import mongoose, { Schema } from "mongoose";
import { AuthProvider, IUser, UserRole } from "../interfaces/user";

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.CREDENTIALS,
    },
    role: { type: String, required: true, enum: Object.values(UserRole), default: UserRole.VOLUNTEER },
    referred_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model<IUser>("user", UserSchema);

export default User;
