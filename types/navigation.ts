export type NavItem = {
  label: string;
  href: string;
  className?: string;
};

export type UserRole = 'organization' | 'volunteer';

export type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
};

export type Session = {
  user?: SessionUser;
}; 