// /server/router.ts
import { authRouter } from "./modules/auth";
import { userRouter } from "./modules/users";
import { volunteerProfileRouter } from "./modules/volunteer-profile";
import { opportunityRouter } from "./modules/opportunity";
import { router } from "./trpc";
import { uploadRouter } from "./modules/upload";
import { organizationProfileRouter } from "./modules/organization-profile";
import { volunteerApplicationRouter } from "./modules/volunteer-application";
import { organisationRecruitmentRouter } from "@/server/modules/organisation-recruitment";
import { messsageRouter } from "./modules/message";
import { organizationMentorRouter } from "./modules/organization-mentors";
import { notificationRouter } from "./modules/notification";
import { initializeCronJobs } from "./services/init-cron";

// Initialize cron jobs when the module is loaded
if (process.env.NODE_ENV !== 'test') {
  initializeCronJobs();
}

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  volunteers: volunteerProfileRouter,
  opportunities: opportunityRouter,
  upload: uploadRouter,
  organizations: organizationProfileRouter,
  applications: volunteerApplicationRouter,
  recruits: organisationRecruitmentRouter,
  messages: messsageRouter,
  mentors: organizationMentorRouter,
  notifications: notificationRouter
});

export type AppRouter = typeof appRouter;
