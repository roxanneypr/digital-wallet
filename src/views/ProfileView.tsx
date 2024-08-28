import React, { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';

interface Profile {
  name: string;
  email: string;
}

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({ name: '', email: '' });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch the user data from localStorage
        const storedUser = localStorage.getItem('userInfo');
        const storedUserData = storedUser ? JSON.parse(storedUser) : null;

        if (storedUserData) {
          setProfile({
            name: `${storedUserData.firstName} ${storedUserData.lastName}`,
            email: storedUserData.email,
          });
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <img src="/assets/loading.svg" alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <User className="mr-2" size={18} /> Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.name}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Mail className="mr-2" size={18} /> Email address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.email}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ProfileView;
