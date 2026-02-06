import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const AdminCustomerEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        is_active: true
    });

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const res = await customerAPI.getDetails(id!);
            const { customer } = res;
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || '',
                password: '',
                password_confirmation: '',
                is_active: Boolean(customer.is_active)
            });
        } catch (error) {
            console.error('Error fetching customer details:', error);
            addNotification('Failed to load customer details', 'error');
            navigate('/admin/customers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.password_confirmation) {
            addNotification('Passwords do not match', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await customerAPI.update(id!, formData);
            addNotification('Customer updated successfully', 'success');
            navigate(`/admin/customers/${id}`);
        } catch (error: any) {
            console.error('Error updating customer:', error);
            addNotification(error.message || 'Failed to update customer', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-gray-500 font-medium">Loading customer data...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(`/admin/customers/${id}`)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
                    <p className="text-gray-500">Update customer information</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter mobile number"
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center h-full pt-8">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                <span className="ms-3 text-sm font-medium text-gray-700">
                                    {formData.is_active ? 'Verified & Active' : 'Unverified / Inactive'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <p className="text-sm text-gray-500 mb-4">Leave blank to keep the current password.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Confirm new password"
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/customers/${id}`)}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Customer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCustomerEditPage;
