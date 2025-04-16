import { authValidation } from "@/server/modules/auth/auth.validation";
import { z } from "zod";

export type SignupForm = z.infer<typeof authValidation.signupSchema>;
