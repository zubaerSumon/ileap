// /server/router.ts
import { authRouter } from './modules/auth';
import { userRouter } from './modules/users';
import { router } from './trpc';
  

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  //upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
