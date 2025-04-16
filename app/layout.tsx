import { Inter } from 'next/font/google';
import './globals.css';
 import { ClientProviders } from '@/config/ClientProviders';
import TopNavigationBar from '@/components/TopNavigationBar';
import { auth } from '@/auth';
  

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'iLEAP - Volunteer Platform',
  description: 'Connect organizations with passionate volunteers',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders session={session}>
        <TopNavigationBar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
