// In your /app/api/auth/[...nextauth]/route.ts file:
import { auth } from "@/lib/auth";

// Export the auth handler for both GET and POST requests
export { auth as GET, auth as POST };