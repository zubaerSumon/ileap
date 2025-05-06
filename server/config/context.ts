import { auth } from "@/auth";
import mongoose from "mongoose";
import connectDB from "./mongoose";

export const createContext = async () => {
  const session = await auth();

  await connectDB();

  return {
    user: session?.user || null,
    session: session || null,
    db: mongoose.connection,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
