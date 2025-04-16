'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  FileTextIcon, 
  PenToolIcon, 
  LayoutTemplateIcon, 
  PieChartIcon, 
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links: SidebarLink[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon size={20} />,
    },
    {
      name: 'Analyze Resume',
      href: '/analyze',
      icon: <FileTextIcon size={20} />,
    },
    {
      name: 'Build Resume',
      href: '/build',
      icon: <PenToolIcon size={20} />,
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: <LayoutTemplateIcon size={20} />,
    },
    {
      name: 'Score',
      href: '/score',
      icon: <PieChartIcon size={20} />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <SettingsIcon size={20} />,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3 }}
      className={`h-screen bg-white fixed left-0 top-0 z-40 shadow-lg pt-20`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-24 -right-3 bg-white p-1.5 rounded-full shadow-md border border-gray-200"
      >
        {collapsed ? (
          <ChevronRightIcon size={16} />
        ) : (
          <ChevronLeftIcon size={16} />
        )}
      </button>

      <div className="flex flex-col h-full p-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 font-medium"
                >
                  {link.name}
                </motion.span>
              )}
              {isActive && (
                <motion.div 
                  className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className={`p-4 rounded-lg bg-blue-50 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed && (
            <div className="mb-2 text-sm font-medium text-blue-700">Need help?</div>
          )}
          <Link
            href="/support"
            className="flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {collapsed ? '?' : 'Get Support'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 