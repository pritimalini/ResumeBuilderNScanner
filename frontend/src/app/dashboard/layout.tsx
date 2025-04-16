'use client';

import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[240px] p-6 pt-24">
        {children}
      </div>
    </div>
  );
} 