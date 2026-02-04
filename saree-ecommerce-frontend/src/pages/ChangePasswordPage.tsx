import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';

const ChangePasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.new_password_confirmation) {
      addNotification('New passwords do not match', 'error');
      return;
    }

    if (formData.new_password.length < 8) {
      addNotification('New password must be at least 8 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      addNotification('Password changed successfully!', 'success');

      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      addNotification(err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Please login to change your password.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Change Password</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--color-primary)', borderColor: 'var(--color-primary)' } as any}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              fullWidth
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
