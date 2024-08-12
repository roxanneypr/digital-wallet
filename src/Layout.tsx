import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useAuth } from './context/AuthProvider';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(tab);
    setIsSidebarOpen(false); 
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className={`${theme} flex h-screen bg-gray-100 dark:bg-gray-900`}>
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={logout} 
        isOpen={isSidebarOpen} 
        onToggle={handleToggleSidebar} 
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Header 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          onLogout={logout} 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={handleToggleSidebar} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
