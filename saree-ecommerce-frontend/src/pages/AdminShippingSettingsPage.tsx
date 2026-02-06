import React, { useState, useEffect } from 'react';
import { shippingSettingsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader2, Save, Truck } from 'lucide-react';

const AdminShippingSettingsPage: React.FC = () => {
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        shipping_fee: '99',
        free_shipping_threshold: '1000',
        express_delivery_label: 'Express Delivery',
        express_delivery_subtitle: 'Ships in 24-48 hours',
        standard_delivery_label: 'Standard Delivery',
        standard_delivery_subtitle: 'Delivery in 5-7 business days'
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await shippingSettingsAPI.get();
            // Data is key-value object
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error: any) {
            console.error(error);
            addNotification('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await shippingSettingsAPI.update(settings);
            addNotification('Shipping settings updated successfully', 'success');
        } catch (error: any) {
            console.error(error);
            addNotification(error.message || 'Failed to update settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <Truck className="text-primary" /> Shipping Configuration
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* General Settings */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Fee Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Shipping Fee (₹)</label>
                                <input
                                    type="number"
                                    name="shipping_fee"
                                    value={settings.shipping_fee}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Applied when order total is below threshold.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
                                <input
                                    type="number"
                                    name="free_shipping_threshold"
                                    value={settings.free_shipping_threshold}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping.</p>
                            </div>
                        </div>
                    </div>

                    {/* Express Delivery Display */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Express Delivery Display</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label / Title</label>
                                <input
                                    type="text"
                                    name="express_delivery_label"
                                    value={settings.express_delivery_label}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
                                <input
                                    type="text"
                                    name="express_delivery_subtitle"
                                    value={settings.express_delivery_subtitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Configuration
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminShippingSettingsPage;
