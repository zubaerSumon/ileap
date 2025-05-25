import { NavItem } from '@/types/navigation';

export const PUBLIC_NAV_OPTIONS: NavItem[] = [
  { label: "Log in", href: "/signin", className: "hover:underline" },
  {
    label: "Organisation Sign up",
    href: "/signup?role=organization",
    className: "hover:underline hidden md:inline",
  },
  {
    label: "Volunteer-Sign up",
    href: "/signup?role=volunteer",
    className: "hover:underline hidden md:inline",
  },
];

export const STATIC_LINKS: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Gallery", href: "/ausleap/gallery" },
];

export const PROTECTED_PATHS = [
  'volunteer',
  'organization',
  'opportunities',
  'find-volunteer'
];

export const AUTH_PATHS = [
  'signin',
  'signup',
  'reset-password'
]; 