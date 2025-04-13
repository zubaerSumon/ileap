 import { AuthError } from "@/lib/exceptions";
import { errorHandler } from "./error-handler";
import { middleware, publicProcedure } from "../routers/trpc";

type User = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
} | null;

type Context = {
  user?: User | null;
};

const withAuth = middleware(async ({ ctx, next }) => {
  const contextWithSession = ctx as Context;

  try {
    if (!contextWithSession.user) {
      throw new AuthError("You must be logged in to access this resource.");
    }

    return next({
      ctx: {
        ...contextWithSession,
        session: contextWithSession.user,
      },
    });
  } catch (error) {
    const { message } = errorHandler(error);
    throw new AuthError(message);
  }
});

export const protectedProcedure = publicProcedure.use(withAuth);
