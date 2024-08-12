import React from 'react';
import { FaCheckCircle, FaStar, FaUserCircle  } from 'react-icons/fa';

interface UserProfileOverviewProps {
  userName: string;
  userEmail: string;
}

function UserProfileOverview({ userName, userEmail }: UserProfileOverviewProps) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center relative flex flex-col items-center">
        {/* Avatar */}
        <div className="relative">
          <FaUserCircle className="w-24 h-24 text-gray-600" />
          
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 flex items-center bg-white rounded-full p-1 shadow">
            <FaCheckCircle className="text-blue-500" />
          </div>
        </div>
        
        {/* User Info */}
        <h3 className="text-lg font-medium text-gray-900 mt-4">{userName}</h3>
        <p className="text-gray-600">{userEmail}</p>
      </div>
    );
  }

export default UserProfileOverview;
