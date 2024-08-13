import React, { useState } from 'react';
import { Bell, DollarSign, CreditCard } from 'lucide-react';

interface Notification {
  id: number;
  type: 'alert' | 'transaction' | 'card';
  message: string;
  time: string;
}

function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'alert', message: 'Low balance in your checking account', time: '2 hours ago' },
    { id: 2, type: 'transaction', message: 'You received $500 from John Doe', time: '1 day ago' },
    { id: 3, type: 'card', message: 'Your new credit card has been shipped', time: '3 days ago' },
  ]);

  const getIcon = (type: 'alert' | 'transaction' | 'card') => {
    switch (type) {
      case 'alert':
        return <Bell className="text-yellow-500 w-6 h-6" />;
      case 'transaction':
        return <DollarSign className="text-green-500 w-6 h-6" />;
      case 'card':
        return <CreditCard className="text-blue-500 w-6 h-6" />;
      default:
        return <Bell className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white shadow overflow-hidden sm:rounded-lg p-4 flex items-start sm:flex-row flex-col"
        >
          <div className="flex-shrink-0 sm:mr-4 mb-2 sm:mb-0">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
            <p className="text-sm text-gray-500">{notification.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationsView;
