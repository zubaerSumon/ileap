import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import TopNavigationBar from '../components/TopNavigationBar';
import Footer from '../components/Footer';

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
        <Providers>
          <TopNavigationBar />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
