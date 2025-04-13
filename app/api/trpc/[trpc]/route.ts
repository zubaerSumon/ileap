import { createContext } from "@/server/config/context";
import { appRouter } from "@/server/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
 

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createContext,
  });

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };
