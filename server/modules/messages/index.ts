/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { sendMessageSchema, getMessagesSchema } from "./messages.validation";
import Message from "../../db/models/message";
import { Types } from "mongoose";
import User from "../../db/models/user";
import { JwtPayload } from "jsonwebtoken";
import { router } from "@/server/trpc";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { z } from "zod";

export const messagesRouter = router({
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

        return message;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to send message",
        });
      }
    }),

  getMessages: protectedProcedure
    .input(getMessagesSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { userId, page = 1, limit = 20 } = input;
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

        const messages = await Message.find({
          $or: [
            { sender: currentUserId, receiver: userId },
            { sender: userId, receiver: currentUserId },
          ],
        })
          .sort({ createdAt: 1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("sender", "name avatar")
          .populate("receiver", "name avatar");

        return messages;
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

      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: new Types.ObjectId(currentUserId) },
              { receiver: new Types.ObjectId(currentUserId) },
            ],
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
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            "user.name": 1,
            "user.avatar": 1,
            "lastMessage.content": 1,
            "lastMessage.createdAt": 1,
            "lastMessage.isRead": 1,
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
});
