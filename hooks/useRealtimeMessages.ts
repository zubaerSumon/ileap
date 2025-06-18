import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

// Define proper types for message data that matches the cache structure
interface MessageData {
  _id: string;
  content: string;
  sender: string | { _id: string; name: string; avatar: string; role?: string };
  receiver?: string | { _id: string; name: string; avatar: string; role?: string };
  group?: string | { _id: string; name: string };
  isRead: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v: number;
}

interface RealtimeMessageData {
  message: MessageData;
  type: 'new' | 'read';
}

export const useRealtimeMessages = (selectedUserId: string | null, isGroup: boolean) => {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  console.log('🔧 useRealtimeMessages - Session:', session?.user?.id, 'SelectedUser:', selectedUserId, 'IsGroup:', isGroup);

  // Subscribe to real-time messages
  trpc.messages.onMessage.useSubscription(
    { userId: session?.user?.id || "" },
    {
      enabled: !!session?.user?.id, // Enable for all authenticated users
      onData: (data) => {
        const messageData = data as RealtimeMessageData;
        console.log('🔄 Real-time message received:', messageData);
        console.log('📨 Current user ID:', session?.user?.id);
        console.log('📨 Message sender/receiver check:', {
          targetUserId: messageData.message.receiver,
          senderId: messageData.message.sender,
          currentUserId: session?.user?.id,
          isCurrentUserSender: messageData.message.sender === session?.user?.id,
          isCurrentUserReceiver: messageData.message.receiver === session?.user?.id
        });
        
        if (messageData.type === 'new') {
          console.log('📨 Adding new message to chat area...');
          console.log('📨 Current conversation:', { selectedUserId, isGroup });
          
          // Check if this is the sender's own message
          const isOwnMessage = messageData.message.sender === session?.user?.id;
          console.log('📨 Is own message:', isOwnMessage);
          
          // Only update if we have a selected conversation
          if (!selectedUserId) {
            console.log('❌ No selected conversation, skipping cache update');
            return;
          }
          
          // Check if this message is for the current conversation
          const messageSenderId = typeof messageData.message.sender === 'string' ? messageData.message.sender : messageData.message.sender._id;
          const messageReceiverId = typeof messageData.message.receiver === 'string' ? messageData.message.receiver : messageData.message.receiver?._id;
          const currentUserId = session?.user?.id;
          
          console.log('🔍 Message relevance check:', {
            messageSenderId,
            messageReceiverId,
            currentUserId,
            selectedUserId,
            isGroup
          });
          
          // For direct messages, check if the message is between the current user and selected user
          const isRelevantMessage = isGroup ? 
            // For group messages, check if the message is for the current group
            (typeof messageData.message.group === 'string' ? messageData.message.group : messageData.message.group?._id) === selectedUserId
            : 
            // For direct messages, check if it's between current user and selected user
            // Handle both ObjectId and string comparisons
            (messageSenderId === currentUserId) && 
            (messageReceiverId === selectedUserId) ||
            (messageSenderId === selectedUserId) && 
            (messageReceiverId === currentUserId);
          
          if (!isRelevantMessage) {
            console.log('❌ Message not for current conversation, skipping cache update');
            return;
          }
          
          console.log('✅ Message is for current conversation, updating cache...');
          
          // Update infinite query cache with new message
          if (isGroup) {
            console.log('📨 Updating group messages...');
            utils.messages.getGroupMessages.setInfiniteData(
              { groupId: selectedUserId || "", limit: 20 },
              (oldData) => {
                if (!oldData) {
                  console.log('❌ No old data found for group messages');
                  return oldData;
                }
                
                console.log('📝 Updating group messages cache...', {
                  currentPages: oldData.pages.length,
                  firstPageMessages: oldData.pages[0]?.messages?.length || 0
                });
                
                // Add the new message to the first page
                const newPages = [...oldData.pages];
                if (newPages.length > 0) {
                  // Check if this is replacing an optimistic message (for sender's own messages)
                  const isOwnMessage = messageData.message.sender === session?.user?.id;
                  
                  let updatedMessages;
                  if (isOwnMessage) {
                    // For sender's own messages, replace any optimistic message with the real one
                    const optimisticMessageIndex = newPages[0].messages.findIndex(msg => 
                      msg._id.startsWith('temp-') && msg.content === messageData.message.content
                    );
                    
                    if (optimisticMessageIndex !== -1) {
                      console.log('🔄 Replacing optimistic group message with real message');
                      updatedMessages = newPages[0].messages.map((msg, index) => 
                        index === optimisticMessageIndex ? messageData.message as MessageData : msg
                      );
                    } else {
                      // If no optimistic message found, add the real message
                      updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                    }
                  } else {
                    // For messages from others, just add the new message
                    updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                  }
                  
                  newPages[0] = {
                    ...newPages[0],
                    messages: updatedMessages,
                  };
                }
                
                console.log('✅ Group messages updated in cache', {
                  newFirstPageMessages: newPages[0]?.messages?.length || 0
                });
                
                // If the cache update didn't work (same number of messages), force a refetch
                if (newPages[0]?.messages?.length === oldData.pages[0]?.messages?.length) {
                  console.log('⚠️ Cache update did not work, forcing refetch...');
                  utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId || "" });
                }
                
                return {
                  ...oldData,
                  pages: newPages,
                };
              }
            );
          } else {
            console.log('📨 Updating direct messages...');
            utils.messages.getMessages.setInfiniteData(
              { userId: selectedUserId || "", limit: 20 },
              (oldData) => {
                if (!oldData) {
                  console.log('❌ No old data found for direct messages');
                  return oldData;
                }
                
                console.log('📝 Updating direct messages cache...', {
                  currentPages: oldData.pages.length,
                  firstPageMessages: oldData.pages[0]?.messages?.length || 0
                });
                
                // Add the new message to the first page
                const newPages = [...oldData.pages];
                if (newPages.length > 0) {
                  // Check if this is replacing an optimistic message (for sender's own messages)
                  const isOwnMessage = messageData.message.sender === session?.user?.id;
                  
                  let updatedMessages;
                  if (isOwnMessage) {
                    // For sender's own messages, replace any optimistic message with the real one
                    const optimisticMessageIndex = newPages[0].messages.findIndex(msg => 
                      msg._id.startsWith('temp-') && msg.content === messageData.message.content
                    );
                    
                    if (optimisticMessageIndex !== -1) {
                      console.log('🔄 Replacing optimistic message with real message');
                      updatedMessages = newPages[0].messages.map((msg, index) => 
                        index === optimisticMessageIndex ? messageData.message as MessageData : msg
                      );
                    } else {
                      // If no optimistic message found, add the real message
                      updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                    }
                  } else {
                    // For messages from others, just add the new message
                    updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                  }
                  
                  newPages[0] = {
                    ...newPages[0],
                    messages: updatedMessages,
                  };
                }
                
                console.log('✅ Direct messages updated in cache', {
                  newFirstPageMessages: newPages[0]?.messages?.length || 0
                });
                
                // If the cache update didn't work (same number of messages), force a refetch
                if (newPages[0]?.messages?.length === oldData.pages[0]?.messages?.length) {
                  console.log('⚠️ Cache update did not work, forcing refetch...');
                  utils.messages.getMessages.invalidate({ userId: selectedUserId || "" });
                }
                
                return {
                  ...oldData,
                  pages: newPages,
                };
              }
            );
          }
        }
      },
    }
  );

  // Subscribe to conversation updates
  trpc.messages.onConversationUpdate.useSubscription(
    { userId: session?.user?.id || "" },
    {
      enabled: !!session?.user?.id,
      onData: () => {
        // Invalidate conversations when there are updates
        utils.messages.getConversations.invalidate();
        utils.messages.getGroups.invalidate();
      },
    }
  );

  // Subscribe to group messages specifically
  trpc.messages.onMessage.useSubscription(
    { userId: session?.user?.id || "" },
    {
      enabled: !!session?.user?.id && isGroup, // Only enable for group conversations
      onData: (data) => {
        const messageData = data as RealtimeMessageData;
        console.log('🔄 Group message received:', messageData);
        
        if (messageData.type === 'new') {
          console.log('📨 Adding new group message to chat area...');
          console.log('📨 Current group:', { selectedUserId, isGroup });
          
          // Only update if we have a selected group conversation
          if (!selectedUserId || !isGroup) {
            console.log('❌ No selected group conversation, skipping cache update');
            return;
          }
          
          // Check if this group message is for the current group
          const messageGroupId = typeof messageData.message.group === 'string' ? messageData.message.group : messageData.message.group?._id;
          const currentUserId = session?.user?.id;
          
          console.log('🔍 Group message relevance check:', {
            messageGroupId,
            currentUserId,
            selectedUserId,
            isGroup
          });
          
          // For group messages, check if the message is for the current group
          const isRelevantGroupMessage = messageGroupId === selectedUserId;
          
          if (!isRelevantGroupMessage) {
            console.log('❌ Group message not for current group, skipping cache update');
            return;
          }
          
          console.log('✅ Group message is for current group, updating cache...');
          
          // Update group messages cache
          utils.messages.getGroupMessages.setInfiniteData(
            { groupId: selectedUserId || "", limit: 20 },
            (oldData) => {
              if (!oldData) {
                console.log('❌ No old data found for group messages');
                return oldData;
              }
              
              console.log('📝 Updating group messages cache...', {
                currentPages: oldData.pages.length,
                firstPageMessages: oldData.pages[0]?.messages?.length || 0
              });
              
              // Add the new message to the first page
              const newPages = [...oldData.pages];
              if (newPages.length > 0) {
                // Check if this is replacing an optimistic message (for sender's own messages)
                const isOwnMessage = messageData.message.sender === session?.user?.id;
                
                let updatedMessages;
                if (isOwnMessage) {
                  // For sender's own messages, replace any optimistic message with the real one
                  const optimisticMessageIndex = newPages[0].messages.findIndex(msg => 
                    msg._id.startsWith('temp-') && msg.content === messageData.message.content
                  );
                  
                  if (optimisticMessageIndex !== -1) {
                    console.log('🔄 Replacing optimistic group message with real message');
                    updatedMessages = newPages[0].messages.map((msg, index) => 
                      index === optimisticMessageIndex ? messageData.message as MessageData : msg
                    );
                  } else {
                    // If no optimistic message found, add the real message
                    updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                  }
                } else {
                  // For messages from others, just add the new message
                  updatedMessages = [...newPages[0].messages, messageData.message as MessageData];
                }
                
                newPages[0] = {
                  ...newPages[0],
                  messages: updatedMessages,
                };
              }
              
              console.log('✅ Group messages updated in cache', {
                newFirstPageMessages: newPages[0]?.messages?.length || 0
              });
              
              // If the cache update didn't work (same number of messages), force a refetch
              if (newPages[0]?.messages?.length === oldData.pages[0]?.messages?.length) {
                console.log('⚠️ Cache update did not work, forcing refetch...');
                utils.messages.getGroupMessages.invalidate({ groupId: selectedUserId || "" });
              }
              
              return {
                ...oldData,
                pages: newPages,
              };
            }
          );
        }
      },
    }
  );
}; 