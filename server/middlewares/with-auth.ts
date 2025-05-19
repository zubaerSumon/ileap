import { AuthError } from "@/lib/exceptions";
import { errorHandler } from "./error-handler";
import { middleware, publicProcedure } from "../trpc";

type User = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
} | null;

type Context = {
  user?: User | null;
};

const withAuth = middleware(async ({ ctx, next, path }) => {
  const contextWithSession = ctx as Context;

  try {
    if (!contextWithSession.user) {
      throw new AuthError("You must be logged in to access this resource.");
    }

    // Add role check using the TRPC path instead of req.url
    const userRole = contextWithSession.user.role;
    
    // Check if user is accessing their role-specific routes
    if (path.includes('volunteer.') && userRole !== 'volunteer') {
      throw new AuthError("Access denied. Volunteer access only.");
    }
    
    if (path.includes('organization.') && userRole !== 'organization') {
      throw new AuthError("Access denied. Organization access only.");
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
