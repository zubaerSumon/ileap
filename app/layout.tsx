import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/config/ClientProviders";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AusLeap - Volunteer Platform",
  description: "Connect organizations with passionate volunteers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth() || null;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} `}>
        <ClientProviders session={session}>
          {children}
          <Toaster position="top-center" />
        </ClientProviders>
      </body>
    </html>
  );
}
