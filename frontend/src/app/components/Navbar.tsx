'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check if user is logged in
    const checkAuth = () => {
      // This would typically check a token in localStorage or cookies
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    // Redirect to home page
    window.location.href = '/';
  };

  // Different nav links based on authentication status
  const publicNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Templates', href: '/templates' },
  ];

  const privateNavLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Job Matches', href: '/job-matches' },
    { name: 'Resume Builder', href: '/resume-builder' },
    { name: 'Resume Analysis', href: '/score' },
    { name: 'Saved Jobs', href: '/saved-jobs' },
    { name: 'Templates', href: '/templates' },
  ];

  const navLinks = isLoggedIn ? privateNavLinks : publicNavLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md font-medium rounded-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 