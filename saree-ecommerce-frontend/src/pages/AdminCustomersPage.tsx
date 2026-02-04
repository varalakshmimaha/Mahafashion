import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { Search, User as UserIcon, Eye, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    orders_count: number;
    created_at: string;
}

const AdminCustomersPage: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<any>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await customerAPI.list({ page, search });
            setCustomers(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page,
                total: response.total
            });
        } catch (error: any) {
            console.error('Error fetching customers:', error);
            addNotification('Failed to load customers', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCustomers(1, searchQuery);
    };

    const toggleStatus = async (id: number) => {
        try {
            const res = await customerAPI.toggleStatus(id);
            setCustomers(customers.map(c => c.id === id ? { ...c, is_active: res.is_active } : c));
            addNotification(res.message, 'success');
        } catch (error: any) {
            addNotification('Failed to update status', 'error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <div className="text-sm text-gray-500">
                    Total Customers: {pagination?.total || 0}
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <Loader2 className="animate-spin" size={20} />
                                            Loading customers...
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <UserIcon size={20} className="text-gray-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                    <div className="text-xs text-gray-500">ID: #{customer.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{customer.email}</div>
                                            <div className="text-xs text-gray-500">{customer.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {customer.orders_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleStatus(customer.id)}
                                                className={`p-1.5 rounded-lg transition-colors ${customer.is_active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'
                                                    }`}
                                                title={customer.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                {customer.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                                                className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing Page {pagination.current_page} of {pagination.last_page}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() => fetchCustomers(pagination.current_page - 1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => fetchCustomers(pagination.current_page + 1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomersPage;
