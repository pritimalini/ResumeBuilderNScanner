import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileAlt, FaUserEdit, FaCog, FaBars, FaTimes, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdDashboard, MdOutlineMenuBook } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

// --- Clean Professional Layout ---

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', name: 'Dashboard', icon: <MdDashboard /> },
  { path: '/scanner', name: 'Resume Scanner', icon: <FaFileAlt /> },
  { path: '/builder', name: 'Resume Builder', icon: <FaUserEdit /> },
  { path: '/optimization-tips', name: 'Optimization Tips', icon: <MdOutlineMenuBook /> },
  { path: '/settings', name: 'Settings', icon: <FaCog /> },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => router.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-slate-50' : 'bg-gray-900'}`}>
      {/* Simple background pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-br from-slate-50 to-slate-100' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`} />
      <div className={`absolute inset-0 opacity-5 ${theme === 'light' ? 'bg-[url("/grid.svg")]' : 'bg-[url("/grid.svg")]'}`} />
      
      {/* Top Header - Mobile only */}
      <header className={`fixed top-0 left-0 right-0 h-16 md:hidden z-30 transition-all duration-300 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-gray-800 border-gray-700'} border-b ${scrolled ? 'shadow-md' : ''}`}>
        <div className="flex items-center justify-between h-full px-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded transition-all duration-300 ${theme === 'light' ? 'text-gray-700 hover:bg-slate-100' : 'text-gray-300 hover:bg-gray-700'}`}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.div>
            </AnimatePresence>
          </button>
          
          <Link href="/" className="flex items-center">
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Resume ATS</h1>
              <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>AI-Powered Optimization</p>
            </div>
          </Link>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded transition-all duration-300 ${theme === 'light' ? 'text-gray-700 hover:bg-slate-100' : 'text-gray-300 hover:bg-gray-700'}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>
      </header>
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 w-64 hidden md:flex flex-col z-20 border-r transition-all duration-300 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-gray-800 border-gray-700'}`}>
        <div className="flex items-center px-6 py-6">
          <div className="flex flex-col items-center py-6 border-b border-slate-200 dark:border-gray-700 mb-4">
            <Link href="/" className="flex flex-col items-center">
              <h1 className={`text-2xl font-bold tracking-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Resume ATS</h1>
              <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>AI-Powered Optimization</p>
            </Link>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded transition-all duration-300 mt-4 ${theme === 'light' ? 'text-gray-700 hover:bg-slate-100' : 'text-gray-300 hover:bg-gray-700'}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>
          </div>
        </div>
        
        <div className="px-4 mb-6">
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? `text-gray-400 ${searchFocused ? 'text-gray-600' : ''}` : `text-gray-500 ${searchFocused ? 'text-gray-300' : ''}`}`}>
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className={`w-full py-2 pl-10 pr-4 rounded border transition-all duration-300 focus:outline-none ${theme === 'light' 
                ? `bg-white border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 ${searchFocused ? 'border-blue-500' : ''}` 
                : `bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 ${searchFocused ? 'border-blue-500' : ''}`
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <nav className="flex-1 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center px-4 py-2 rounded font-medium text-sm transition-all duration-150 gap-3 ${isActive(item.path) 
                  ? `${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-gray-700 text-white'}` 
                  : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className={`mt-auto p-4 border-t text-xs text-center ${theme === 'light' ? 'border-slate-200 text-gray-500' : 'border-gray-700 text-gray-500'}`}>
          <p>Resume ATS Optimizer</p>
          <p>Version 1.0.0</p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`w-64 h-full shadow-lg flex flex-col py-4 px-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between w-full border-b pb-4 border-slate-200 dark:border-gray-700">
                <div>
                  <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Resume ATS</h1>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>AI-Powered Optimization</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded transition-all duration-300 ${theme === 'light' ? 'text-gray-700 hover:bg-slate-100' : 'text-gray-300 hover:bg-gray-700'}`}
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
                </button>
              </div>
              
              <div className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path} 
                    className={`flex items-center px-4 py-2 rounded font-medium text-sm transition-all duration-150 gap-3 ${isActive(item.path) 
                      ? `${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-gray-700 text-white'}` 
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className={`mt-auto pt-4 border-t text-xs text-center ${theme === 'light' ? 'border-slate-200 text-gray-500' : 'border-gray-700 text-gray-500'}`}>
                <p>Resume ATS Optimizer</p>
                <p>Version 1.0.0</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Spacer for sidebar on desktop */}
        <div className="hidden md:block w-72 flex-shrink-0"></div>
        
        {/* Main content area */}
        <main className="flex-1 pt-16 md:pt-6 pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={pageTransition}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              exit="exit"
              className="min-h-[calc(100vh-8rem)] relative z-10"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
