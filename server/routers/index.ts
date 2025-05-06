// /server/router.ts
import { authRouter } from '../modules/auth';
import { router } from './trpc';
//import { userRouter } from './modules/users';
 

export const appRouter = router({
  //users: userRouter,
  auth: authRouter,
  //upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
