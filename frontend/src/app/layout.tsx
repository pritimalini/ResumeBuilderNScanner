'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
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
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="resume-ai-theme"
        >
          <AuthProvider>
            {/* Always render the Navbar but conditionally apply styles */}
            {showNavbar ? <Navbar /> : null}
            <main className={`min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
