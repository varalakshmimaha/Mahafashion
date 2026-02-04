import React, { useState, useEffect } from 'react';
import { Power, Settings, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext'; // Assuming NotificationContext exists
import { API_BASE_URL } from '../services/api';

interface PaymentGatewayConfig {
  [key: string]: any;
}

interface PaymentGateway {
  id: number;
  name: string;
  display_name: string;
  is_enabled: boolean;
  config: PaymentGatewayConfig | null;
  created_at: string;
  updated_at: string;
}

const AdminPaymentGatewaysPage: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // For toggle/config actions
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payment-gateways`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch payment gateways');
      }
      const data: PaymentGateway[] = await response.json();
      setGateways(data);
    } catch (error: any) {
      console.error('Error fetching payment gateways:', error);
      addNotification(error.message || 'Failed to load payment gateways', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGateway = async (gateway: PaymentGateway) => {
    setSaving(true);
    try {
      const endpoint = gateway.is_enabled
        ? `${API_BASE_URL}/admin/payment-gateways/${gateway.id}/disable`
        : `${API_BASE_URL}/admin/payment-gateways/${gateway.id}/enable`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to change gateway status');
      }

      addNotification(result.message, 'success');
      fetchPaymentGateways(); // Refresh list
    } catch (error: any) {
      console.error('Error toggling gateway status:', error);
      addNotification(error.message || 'Failed to change gateway status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenConfigModal = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setShowConfigModal(true);
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
    setSelectedGateway(null);
    fetchPaymentGateways(); // Refresh list in case config changed
  };

  const GatewayLogo: React.FC<{ name: string }> = ({ name }) => {
    // Placeholder for gateway logos
    let logoSrc = '';
    switch (name.toLowerCase()) {
      case 'razorpay': logoSrc = 'https://razorpay.com/assets/razorpay-logo.svg'; break;
      case 'phonepe': logoSrc = 'https://www.phonepe.com/webstatic/images/phonepe-logo.png'; break;
      case 'paytm': logoSrc = 'https://assetscdn1.paytm.com/images/catalog/view_content/2708781/1598004543788.png'; break;
      case 'cod': logoSrc = 'https://img.icons8.com/ios-filled/50/cash-in-hand.png'; break; // Placeholder from Icons8
      default: logoSrc = 'https://img.icons8.com/ios-filled/50/bank.png'; // Generic
    }
    return <img src={logoSrc} alt={name} className="h-10 w-auto object-contain" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateways</h1>
        <p className="text-gray-600">Manage and configure payment methods for your store.</p>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <div key={gateway.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <GatewayLogo name={gateway.name} />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${gateway.is_enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {gateway.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{gateway.display_name}</h2>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label htmlFor={`toggle-${gateway.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`toggle-${gateway.id}`}
                    className="sr-only"
                    checked={gateway.is_enabled}
                    onChange={() => handleToggleGateway(gateway)}
                    disabled={saving}
                  />
                  <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition shadow-md"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {gateway.is_enabled ? 'Active' : 'Inactive'}
                </div>
              </label>

              <button
                onClick={() => handleOpenConfigModal(gateway)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <Settings size={18} />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && selectedGateway && (
        <PaymentGatewayConfigModal
          gateway={selectedGateway}
          onClose={handleCloseConfigModal}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

// --- PaymentGatewayConfigModal Component (to be implemented next) ---
interface PaymentGatewayConfigModalProps {
  gateway: PaymentGateway;
  onClose: () => void;
  addNotification: (message: string, type: 'success' | 'error') => void;
}

const PaymentGatewayConfigModal: React.FC<PaymentGatewayConfigModalProps> = ({
  gateway,
  onClose,
  addNotification,
}) => {
  const [configFormData, setConfigFormData] = useState<PaymentGatewayConfig>(gateway.config || {});
  const [savingConfig, setSavingConfig] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setConfigFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);

    try {
      const url = `${API_BASE_URL}/admin/payment-gateways/${gateway.id}/update-config`;
      console.log('Submitting config to:', url, configFormData);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 422 && result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(' ');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Failed to update configuration');
      }

      addNotification(result.message, 'success');
      onClose(); // Close modal and refresh parent
    } catch (error: any) {
      console.error('Error saving config:', error);
      addNotification(error.message || 'Failed to save configuration', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const renderConfigForm = () => {
    switch (gateway.name.toLowerCase()) {
      case 'razorpay':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
              <input
                type="text"
                name="key_id"
                value={configFormData.key_id || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
              <input
                type="password" // Use password type for secrets
                name="key_secret"
                value={configFormData.key_secret || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
              <input
                type="password"
                name="webhook_secret"
                value={configFormData.webhook_secret || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                name="mode"
                value={configFormData.mode || 'test'}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>
          </>
        );
      case 'phonepe':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
              <input
                type="text"
                name="merchant_id"
                value={configFormData.merchant_id || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Salt Key</label>
              <input
                type="password"
                name="salt_key"
                value={configFormData.salt_key || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Salt Index</label>
              <input
                type="number"
                name="salt_index"
                value={configFormData.salt_index || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select
                name="environment"
                value={configFormData.environment || 'UAT'}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="UAT">UAT</option>
                <option value="PRODUCTION">Production</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Callback URL</label>
              <input
                type="text"
                name="callback_url"
                value={configFormData.callback_url || `http://127.0.0.1:8000/api/payment/phonepe/callback`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
          </>
        );
      case 'paytm':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
              <input
                type="text"
                name="merchant_id"
                value={configFormData.merchant_id || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Key</label>
              <input
                type="password"
                name="merchant_key"
                value={configFormData.merchant_key || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
              <input
                type="text"
                name="website_name"
                value={configFormData.website_name || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
              <input
                type="text"
                name="industry_type"
                value={configFormData.industry_type || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select
                name="environment"
                value={configFormData.environment || 'Staging'}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </>
        );
      case 'cod':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Order Amount</label>
              <input
                type="number"
                name="max_order_amount"
                value={configFormData.max_order_amount || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
              <input
                type="number"
                name="min_order_amount"
                value={configFormData.min_order_amount || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">COD Charges</label>
              <input
                type="number"
                name="cod_charges"
                value={configFormData.cod_charges || ''}
                onChange={handleConfigChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Allow COD for specific pincodes (comma-separated)</label>
              <textarea
                name="allow_pincodes"
                value={configFormData.allow_pincodes || ''}
                onChange={handleConfigChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 110001, 400001, 700001"
              ></textarea>
            </div>
          </>
        );
      default:
        return <p>No specific configuration available for this gateway.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Configure {gateway.display_name}</h3>
        <form onSubmit={handleSaveConfig}>
          {renderConfigForm()}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={savingConfig}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={savingConfig}
            >
              {savingConfig ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              {savingConfig ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPaymentGatewaysPage;
