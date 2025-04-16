'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/'; // Hide navbar on home page
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased dark:bg-gray-950 dark:text-white`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="resume-ai-theme"
          >
            {/* Always render the Navbar but conditionally apply styles */}
            {showNavbar ? <Navbar /> : null}
            <main className={`min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
