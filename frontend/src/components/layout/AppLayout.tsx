import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PageContainer } from './PageContainer';

export interface AppLayoutProps {
  children?: React.ReactNode;
  fluid?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, fluid = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-seatrace-bg-primary text-seatrace-text-primary flex">
      {/* Sidebar: Fixed left */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <PageContainer fluid={fluid}>
          {children}
        </PageContainer>
      </main>
    </div>
  );
};

export default AppLayout;
