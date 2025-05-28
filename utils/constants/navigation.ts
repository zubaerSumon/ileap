import { NavItem } from '@/types/navigation';

export const PUBLIC_NAV_OPTIONS: NavItem[] = [
 
  {
    label: "Volunteer sign up",
    href: "/signup",
    className: "hover:text-blue-500",
  },
  {
    label: "Organization sign up",
    href: "/signup?role=organization",
    className: "hover:text-blue-500",
  },
   {
    label: "Sign in",
    href: "/signin",
    className: "hover:text-blue-500",
  },
  
];

export const STATIC_LINKS: NavItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
];

export const PROTECTED_PATHS = ["/organization", "/volunteer", "/profile", "/settings", "/messages", "/search"];

export const AUTH_PATHS = ["/signin", "/signup", "/reset-password"];

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "organization" | "volunteer";
  image?: string;
} 