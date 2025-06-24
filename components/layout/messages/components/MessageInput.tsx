import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isSending 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(e);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage || ''}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-9 sm:h-10 flex-1 text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300 focus:border-blue-500"
          />
          <Button 
            type="submit" 
            disabled={!newMessage?.trim() || isSending}
            className="h-9 sm:h-10 bg-blue-500 hover:bg-blue-600 text-white focus-visible:ring-0 focus-visible:ring-offset-0 px-3 sm:px-4 text-sm sm:text-base flex-shrink-0"
          >
            {isSending ? (
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="animate-spin text-xs sm:text-sm">⏳</span>
                <span className="hidden sm:inline">Sending...</span>
                <span className="sm:hidden">...</span>
              </span>
            ) : (
              <span className="hidden sm:inline">Send</span>
            )}
            {!isSending && (
              <svg className="sm:hidden h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;