import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

 
const createInnerTRPCContext = () => {
  return {};
};

export const createTRPCContext = async () => {
  const innerContext = createInnerTRPCContext();
  return {
    ...innerContext,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const middleware = t.middleware;
export const router = t.router;