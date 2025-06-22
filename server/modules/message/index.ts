/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { sendMessageSchema } from "./message.validation";
import { Message } from "../../db/models/message";
import { Types } from "mongoose";
import User from "../../db/models/user";
import { JwtPayload } from "jsonwebtoken";
import { router, observable } from "../../trpc";
import { z } from "zod";
import { Group } from "../../db/models/group";
import { IMessage } from "../../db/interfaces/message";
import { protectedProcedure } from "../../middlewares/with-auth";
import { messagePubSub } from "./subscriptions";

export const messsageRouter = router({
  sendMessage: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { receiverId, content } = input;
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to send messages",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const senderId = user._id;

        const message = await Message.create({
          sender: new Types.ObjectId(senderId),
          receiver: new Types.ObjectId(receiverId),
          content,
        });

        // Populate the sender information for the response
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar role')
          .lean();

        // Publish the new message to both sender and receiver channels
        if (populatedMessage) {
          console.log('📤 Publishing message via tRPC:', {
            senderId: senderId.toString(),
            receiverId: receiverId.toString(),
            messageId: (populatedMessage as any)._id
          });
          
          // Publish to receiver's channel
          messagePubSub.publishNewMessage(receiverId, populatedMessage as Record<string, unknown>);
          // Also publish to sender's channel so their UI updates immediately
          messagePubSub.publishNewMessage(senderId, populatedMessage as Record<string, unknown>);
        }

        return populatedMessage;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to send message",
        });
      }
    }),

  getMessages: protectedProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { userId, limit, cursor } = input;
        const sessionUser = ctx.user as JwtPayload;
        
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view messages",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const currentUserId = user._id;
        const query = {
          $or: [
            { sender: currentUserId, receiver: new Types.ObjectId(userId) },
            { sender: new Types.ObjectId(userId), receiver: currentUserId },
          ],
        };

        const messages = await Message.find(query)
          .sort({ createdAt: -1 })
          .limit(limit + 1)
          .skip(cursor ? 1 : 0)
          .populate('sender', 'name avatar role')
          .lean();

        let nextCursor: string | undefined = undefined;
        if (messages.length > limit) {
          const nextItem = messages.pop();
          if (nextItem && typeof nextItem === 'object' && '_id' in nextItem) {
            nextCursor = (nextItem._id as Types.ObjectId).toString();
          }
        }

        // Mark messages as read
        await Message.updateMany(
          {
            sender: new Types.ObjectId(userId),
            receiver: currentUserId,
            isRead: false,
          },
          {
            $set: { isRead: true },
            $push: {
              readBy: {
                user: currentUserId,
                readAt: new Date(),
              },
            },
          }
        );

        return {
          messages: messages.reverse(),
          nextCursor,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to fetch messages",
        });
      }
    }),

  getConversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view conversations",
        });
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const currentUserId = user._id;

      // Optimize the aggregation pipeline
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: new Types.ObjectId(currentUserId) },
              { receiver: new Types.ObjectId(currentUserId) },
            ],
            group: { $exists: false }, // Exclude group messages
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", new Types.ObjectId(currentUserId)] },
                "$receiver",
                "$sender",
              ],
            },
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$receiver", new Types.ObjectId(currentUserId)] },
                      { $eq: ["$isRead", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $lookup: {
                  from: "organization_profiles",
                  localField: "organization_profile",
                  foreignField: "_id",
                  as: "organization_profile"
                }
              },
              {
                $unwind: {
                  path: "$organization_profile",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $project: {
                  name: 1,
                  avatar: 1,
                  role: 1,
                  organization_profile: {
                    title: 1
                  }
                },
              },
            ],
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            user: 1,
            lastMessage: {
              content: 1,
              isRead: 1,
              createdAt: 1,
            },
            unreadCount: 1,
          },
        },
      ]);

      return conversations;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message || "Failed to fetch conversations",
      });
    }
  }),

  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { conversationId } = input;
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to mark messages as read",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const currentUserId = user._id;

        // Update all unread messages without time restriction
        const result = await Message.updateMany(
          {
            sender: new Types.ObjectId(conversationId),
            receiver: new Types.ObjectId(currentUserId),
            isRead: false
          },
          {
            $set: { isRead: true },
          }
        );

        // Only invalidate if we actually updated something
        if (result.modifiedCount > 0) {
          return { success: true, updatedCount: result.modifiedCount };
        }

        return { success: true, updatedCount: 0 };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to mark messages as read",
        });
      }
    }),

  createGroup: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      memberIds: z.array(z.string()),
      isOrganizationGroup: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a group",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if user is a volunteer
        if (user.role === "volunteer") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Volunteers cannot create groups",
          });
        }

        // Check if user is an admin or mentor when creating an organization group
        if (input.isOrganizationGroup && user.role !== "admin" && user.role !== "mentor") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins and mentors can create organization groups",
          });
        }

        const group = await Group.create({
          name: input.name,
          description: input.description,
          createdBy: user._id,
          members: [...input.memberIds.map(id => new Types.ObjectId(id)), user._id],
          admins: [user._id],
          isOrganizationGroup: input.isOrganizationGroup || false,
        });

        // Get the populated group data
        const populatedGroup = await Group.findById(group._id)
          .populate('members', 'name avatar role')
          .populate('admins', 'name avatar role')
          .lean();

        if (!populatedGroup) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create group",
          });
        }

        // Convert to the expected format
        const formattedGroup = {
          _id: group._id.toString(),
          name: group.name,
          description: group.description,
          members: (populatedGroup as any).members || [],
          admins: (populatedGroup as any).admins || [],
          createdBy: group.createdBy.toString(),
          isOrganizationGroup: group.isOrganizationGroup,
          avatar: group.avatar,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          lastMessage: null,
          unreadCount: 0
        };

        return formattedGroup;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to create group",
        });
      }
    }),

  getGroups: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view groups",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const currentUserId = user._id;

        // Get groups where user is a member
        const groups = await Group.find({ members: currentUserId })
          .populate('members', 'name avatar role')
          .populate('admins', 'name avatar role')
          .lean();

        // Get the last message and unread count for each group
        const groupsWithMessages = await Promise.all(
          groups.map(async (group: any) => {
            const lastMessage = await Message.findOne({ group: group._id })
              .sort({ createdAt: -1 })
              .populate('sender', 'name avatar role')
              .lean() as (IMessage & { sender: { name: string; avatar: string; role: string } }) | null;

            // Count unread messages (messages not in readBy array for current user)
            const unreadCount = await Message.countDocuments({
              group: group._id,
              'readBy.user': { $ne: currentUserId },
              sender: { $ne: currentUserId }, // Don't count own messages
            });

            return {
              ...group,
              lastMessage: lastMessage ? {
                content: lastMessage.content,
                isRead: lastMessage.readBy.some((read: { user: Types.ObjectId }) => 
                  read.user.toString() === currentUserId.toString()
                ),
                createdAt: lastMessage.createdAt,
              } : null,
              unreadCount,
            };
          })
        );

        return groupsWithMessages;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to fetch groups",
        });
      }
    }),

  sendGroupMessage: protectedProcedure
    .input(z.object({
      groupId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to send messages",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const group = await Group.findOne({ _id: input.groupId, members: user._id });
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found or you are not a member",
          });
        }

        const message = await Message.create({
          sender: user._id,
          group: group._id,
          content: input.content,
          readBy: [{ user: user._id }],
        });

        // Populate the sender information for the response
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar role')
          .populate('group', 'name')
          .lean();

        // Publish the new message to all group members
        if (populatedMessage) {
          console.log('📤 Publishing group message via tRPC:', {
            groupId: input.groupId,
            senderId: user._id.toString(),
            messageId: (populatedMessage as any)._id,
            groupMembers: group.members.map((member: Types.ObjectId) => member.toString())
          });
          
          // Publish to all group members
          messagePubSub.publishGroupMessage(
            group.members.map((member: Types.ObjectId) => member.toString()),
            populatedMessage as Record<string, unknown>
          );
        }

        return populatedMessage;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to send message",
        });
      }
    }),

  getGroupMessages: protectedProcedure
    .input(z.object({
      groupId: z.string(),
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { groupId, limit, cursor } = input;
        const sessionUser = ctx.user as JwtPayload;
        
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view messages",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const group = await Group.findById(groupId);
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }

        // Check if user is a member of the group
        if (!group.members.includes(user._id)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not a member of this group",
          });
        }

        const query = { group: new Types.ObjectId(groupId) };
        const messages = await Message.find(query)
          .sort({ createdAt: -1 })
          .limit(limit + 1)
          .skip(cursor ? 1 : 0)
          .populate('sender', 'name avatar role')
          .lean();

        let nextCursor: string | undefined = undefined;
        if (messages.length > limit) {
          const nextItem = messages.pop();
          if (nextItem && typeof nextItem === 'object' && '_id' in nextItem) {
            nextCursor = (nextItem._id as Types.ObjectId).toString();
          }
        }

        // Mark messages as read for the current user
        await Message.updateMany(
          {
            group: new Types.ObjectId(groupId),
            'readBy.user': { $ne: user._id },
          },
          {
            $push: {
              readBy: {
                user: user._id,
                readAt: new Date(),
              },
            },
          }
        );

        return {
          messages: messages.reverse(),
          nextCursor,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to fetch group messages",
        });
      }
    }),

  deleteGroup: protectedProcedure
    .input(z.object({
      groupId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to delete a group",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if user is a volunteer
        if (user.role === "volunteer") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Volunteers cannot delete groups",
          });
        }

        // Find the group
        const group = await Group.findById(input.groupId);
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }

        // Check permissions: Allow if user is admin/mentor/organization OR if user is admin of the group
        const isAdminOrMentor = user.role === "admin" || user.role === "mentor" || user.role === "organisation";
        const isGroupAdmin = group.admins.includes(user._id);
        
        if (!isAdminOrMentor && !isGroupAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this group",
          });
        }

        // Delete all messages in the group (this will work even if no messages exist)
        await Message.deleteMany({ group: group._id });

        // Delete the group
        await Group.deleteOne({ _id: group._id });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to delete group",
        });
      }
    }),

  deleteConversation: protectedProcedure
    .input(z.object({
      conversationId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;
        if (!sessionUser?.email) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to delete a conversation",
          });
        }

        const user = await User.findOne({ email: sessionUser.email });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check if user is a volunteer
        if (user.role === "volunteer") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Volunteers cannot delete conversations",
          });
        }

        // Only allow admin, mentor, or organization users to delete conversations
        const isAdminOrMentor = user.role === "admin" || user.role === "mentor" || user.role === "organization";
        if (!isAdminOrMentor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete conversations",
          });
        }

        // Find the conversation (messages between the user and the target user)
        const conversationId = input.conversationId;
        
        // Delete all messages in the conversation
        await Message.deleteMany({
          $or: [
            { sender: user._id, receiver: conversationId },
            { sender: conversationId, receiver: user._id }
          ]
        });

        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to delete conversation",
        });
      }
    }),

  // Subscription for real-time messages
  onMessage: protectedProcedure.subscription(({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;
    if (!sessionUser?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to subscribe to messages",
      });
    }

    return observable<{ type: string; data: Record<string, unknown> }>((emit) => {
      // Get user ID from session
      const getUser = async () => {
        const user = await User.findOne({ email: sessionUser.email });
        return user?._id?.toString();
      };

      getUser().then((userId) => {
        if (userId) {
          console.log('📡 User subscribing to messages:', userId);
          return messagePubSub.subscribeToMessages(userId);
        }
      }).then((subscription) => {
        if (subscription) {
          subscription.subscribe({
            next: (data) => {
              console.log('📨 Subscription received:', data);
              emit.next(data);
            },
            error: (error) => {
              console.error('❌ Subscription error:', error);
              emit.error(error);
            },
          });
        }
      }).catch((error) => {
        console.error('❌ Failed to setup subscription:', error);
        emit.error(error);
      });

      return () => {
        console.log('📡 User unsubscribing from messages');
      };
    });
  }),
});
