// /server/router.ts
import { authRouter } from './modules/auth';
import { userRouter } from './modules/users';
import { volunteerRouter } from './modules/volunteer-profile';
import { opportunityRouter } from './modules/opportunity';
import { router } from './trpc';
import { uploadRouter } from './modules/upload';
import { organizationProfileRouter } from './modules/organization-profile';
  

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  volunteers: volunteerRouter,
  opportunities: opportunityRouter,
  upload: uploadRouter,
  organizationProfile: organizationProfileRouter
});

export type AppRouter = typeof appRouter;
