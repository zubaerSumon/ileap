// /server/router.ts
import { authRouter } from './modules/auth';
import { userRouter } from './modules/users';
import { volunteerRouter } from './modules/volunteers';
import { opportunityRouter } from './modules/opportunity';
import { router } from './trpc';
  

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  volunteers: volunteerRouter,
  opportunities: opportunityRouter,
});

export type AppRouter = typeof appRouter;
