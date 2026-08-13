import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import ChatbotGate from '@/components/ChatbotGate';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});


const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'ProtonDB Clone',
  description: 'Linux game compatibility reports',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">

        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>

              <Header />

              {children}
              <Footer />
              <ChatbotGate />

            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>

      </body>
    </html>
  );
}