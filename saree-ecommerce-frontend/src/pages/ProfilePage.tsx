import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import DashboardTabs from '../components/dashboard/DashboardTabs';

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    receive_email_notifications: true,
    receive_sms_notifications: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const userData = await authAPI.getCurrentUser();
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          date_of_birth: userData.date_of_birth || '',
          receive_email_notifications: userData.receive_email_notifications || false,
          receive_sms_notifications: userData.receive_sms_notifications || false,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        addNotification('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, addNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update profile through authAPI helper
      const updatedUser = await authAPI.updateProfile(profileData);

      // Update the auth context with new user data
      updateUser(updatedUser);

      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));

      addNotification('Profile updated successfully!', 'success');
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      addNotification(errorMessage, 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Please login to view your profile.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DashboardTabs />
      <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profileData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  name="receive_email_notifications"
                  checked={profileData.receive_email_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                  Receive email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-notifications"
                  name="receive_sms_notifications"
                  checked={profileData.receive_sms_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-700">
                  Receive SMS notifications
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <a
              href="/change-password"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
              className="px-6 py-2 rounded-md hover:opacity-80 transition-colors font-medium"
            >
              Change Password
            </a>
            <button
              type="submit"
              style={{ backgroundColor: 'var(--color-button)', color: '#ffffff' }}
              className="px-6 py-2 rounded-md hover:opacity-90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
