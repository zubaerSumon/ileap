/* eslint-disable @typescript-eslint/no-unused-vars */
import type { JWT } from "next-auth/jwt"; // Necessary for type augmentation

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}
