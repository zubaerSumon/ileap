import User from "@/server/db/models/user";
import { protectedProcedure } from "@/server/middlewares/with-auth";
import { JwtPayload } from "jsonwebtoken";
import { userValidation } from "./users.validation";

import { router } from "@/server/trpc";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(userValidation.updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error("You must be logged in to update this data.");
      }

      const user = await User.findOne({ email: sessionUser.email });

      if (!user) {
        throw new Error("User not found.");
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { ...input },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User update failed");
      }

      return updatedUser;
    }),
});
