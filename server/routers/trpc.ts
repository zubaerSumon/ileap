
import { initTRPC } from "@trpc/server";
import { createContext } from "../config/context";
 

export const t = initTRPC.context<ReturnType<typeof createContext>>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        customMessage: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
    };
  },
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
