import { Inter } from 'next/font/google';
import './globals.css';
 import { ClientProviders } from '@/config/ClientProviders';
import TopNavigationBar from '@/components/TopNavigationBar';
  

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'iLEAP - Volunteer Platform',
  description: 'Connect organizations with passionate volunteers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders session={null}>
        <TopNavigationBar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
