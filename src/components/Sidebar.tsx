import React from 'react';
import { Home, CreditCard, DollarSign, Bell, User, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ activeTab, onTabChange, onLogout, isOpen, onToggle }: SidebarProps) {
  const { kycStatus } = useAuth(); // Fetch the KYC status from the AuthContext
  const isKycApproved = kycStatus === 'approved';

  const sidebarLinks = [
    { icon: <Home />, label: 'Home', key: 'home', clickable: true },
    { icon: <CreditCard />, label: 'Accounts', key: 'accounts', clickable: isKycApproved },
    { icon: <DollarSign />, label: 'Transactions', key: 'transactions', clickable: isKycApproved },
    { icon: <ShoppingBag />, label: 'Store Purchase', key: 'store-purchase', clickable: isKycApproved },
    { icon: <Bell />, label: 'Notifications', key: 'notifications', clickable: true },
    { icon: <User />, label: 'Profile', key: 'profile', clickable: true },
    { icon: <Settings />, label: 'Settings', key: 'settings', clickable: true },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform lg:transform-none lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-md lg:w-64`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">DigiWallet</h1>
        </div>
        <nav className="mt-6">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              className={`flex items-center w-full py-2 px-4 ${
                activeTab === link.key
                  ? 'bg-blue-100 text-blue-600'
                  : link.clickable
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => {
                if (link.clickable) {
                  onTabChange(link.key);
                  onToggle(); // Close the sidebar on mobile when a link is clicked
                }
              }}
              disabled={!link.clickable}
            >
              {React.cloneElement(link.icon, { size: 18, className: 'mr-2' })}
              {link.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            className="flex items-center text-gray-600 hover:text-red-500"
            onClick={() => {
              onLogout();
              onToggle(); // Close the sidebar on mobile when logging out
            }}
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
