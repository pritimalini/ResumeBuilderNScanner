'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

// Create a local ThemeProvider component
function ThemeProvider({ children, ...props }: React.PropsWithChildren<any>) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/'; // Hide navbar on home page
  const [mounted, setMounted] = useState(false);
  
  // Ensures theme is applied after hydration to avoid mismatch
  useEffect(() => setMounted(true), []);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {mounted && (
              <>
                {showNavbar && <Navbar />}
                <main className={`min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
                  {children}
                </main>
              </>
            )}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
