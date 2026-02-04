import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import {
    ArrowLeft, ShoppingBag, IndianRupee, CreditCard,
    MessageSquare, Clock, CheckCircle2, AlertCircle,
    Mail, Phone, Calendar, MapPin, User as UserIcon,
    Loader2, BadgeHelp
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const AdminCustomerDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const res = await customerAPI.getDetails(id!);
            setData(res);
        } catch (error) {
            console.error('Error fetching customer details:', error);
            addNotification('Failed to load customer details', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-gray-500 font-medium">Loading customer profile...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle className="text-red-500" size={48} />
                <h2 className="text-xl font-bold">Customer not found</h2>
                <button onClick={() => navigate('/admin/customers')} className="text-primary hover:underline">
                    Back to list
                </button>
            </div>
        );
    }

    const { customer, stats, order_history } = data;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/customers')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                        <p className="text-gray-500">Customer Profile & Activity History</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {customer.is_active ? 'Active Account' : 'Suspended Account'}
                    </span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Customer Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10"></div>
                        <div className="px-6 pb-6 pt-0 -mt-12 text-center">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white border-4 border-white shadow-md mb-4 overflow-hidden">
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <UserIcon size={48} />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 font-medium">Customer Since: {new Date(customer.created_at).toLocaleDateString()}</p>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={18} className="text-gray-400" />
                                    <span className="text-gray-700">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={18} className="text-gray-400" />
                                    <span className="text-gray-700">{customer.phone || 'No phone provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span className="text-gray-700">Born: {customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            Primary Address
                        </h3>
                        {customer.shipping_address ? (
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{customer.shipping_name || customer.name}</p>
                                <p>{customer.shipping_address}</p>
                                <p>{customer.shipping_city}, {customer.shipping_state} - {customer.shipping_pincode}</p>
                                <p>Phone: {customer.shipping_phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No primary shipping address saved.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stats Cards */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Customer Statistics
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={<ShoppingBag className="text-blue-500" />}
                                label="Total Orders"
                                value={stats.total_orders}
                            />
                            <StatCard
                                icon={<IndianRupee className="text-green-500" />}
                                label="Total Spent"
                                value={`₹${stats.total_spent}`}
                            />
                            <StatCard
                                icon={<CreditCard className="text-purple-500" />}
                                label="Avg Order Value"
                                value={`₹${stats.average_order_value}`}
                            />
                            <StatCard
                                icon={<MessageSquare className="text-orange-500" />}
                                label="Total Queries"
                                value={stats.total_queries}
                            />
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Order Status Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Completed</p>
                                    <p className="text-xl font-bold text-green-900">{stats.completed_orders} Orders</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Pending</p>
                                    <p className="text-xl font-bold text-blue-900">{stats.pending_orders} Orders</p>
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <BadgeHelp size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider">Queries</p>
                                    <p className="text-xl font-bold text-orange-900">{stats.pending_queries} Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Order History
                        </h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {order_history.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-lg font-medium">This customer hasn’t placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No.</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order_history.map((order: any) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                        #{order.order_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                        ₹{order.total}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <button
                                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                            className="text-primary hover:underline font-medium"
                                                        >
                                                            View Invoice
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        </div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
);

const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'shipped': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default AdminCustomerDetailsPage;
