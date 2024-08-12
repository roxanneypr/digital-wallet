import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

function Header({ activeTab, onTabChange, onLogout, isSidebarOpen, onToggleSidebar, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
        </div>

        {/* Dark Mode Toggle Button */}
        <div>
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 focus:outline-none"
          >
            {theme === 'light' ? (
              <FaMoon className="w-5 h-5" />
            ) : (
              <FaSun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
