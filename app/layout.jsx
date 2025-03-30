// app/layout.js
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ContentPlatform - Premium Content Membership',
  description: 'Premium membership platform for exclusive content',
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        <SessionProvider session={session}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}