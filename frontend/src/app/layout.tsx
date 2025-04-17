'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from 'next-themes';
import { JobMatchProvider } from '../context/JobMatchContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Only show navbar on content pages, not on auth or home pages
  const hideNavbarPages = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
  const showNavbar = !hideNavbarPages.includes(pathname);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ResumeAI - Build ATS-Optimized Resumes</title>
        <meta name="description" content="Build ATS-optimized resumes and scan for job compatibility" />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="resume-ai-theme"
        >
          <AuthProvider>
            <JobMatchProvider>
              {/* Only show navbar on content pages */}
              {showNavbar && <Navbar />}
              <main className={`min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
                {children}
              </main>
            </JobMatchProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
