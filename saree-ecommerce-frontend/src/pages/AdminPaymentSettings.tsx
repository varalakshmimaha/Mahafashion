import { useState, useEffect } from 'react';
import { paymentSettingsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  Shield
} from 'lucide-react';

interface PaymentGatewaySettings {
  razorpay: {
    enabled: boolean;
    key_id: string | null;
    key_secret: string | null;
    test_mode: boolean;
  };
  phonepe: {
    enabled: boolean;
    merchant_id: string | null;
    salt_key: string | null;
    salt_index: string | null;
    test_mode: boolean;
  };
  paytm: {
    enabled: boolean;
    merchant_id: string | null;
    merchant_key: string | null;
    website: string;
    industry_type: string;
    test_mode: boolean;
  };
  cod: {
    enabled: boolean;
    min_amount: number;
    max_amount: number;
  };
  updated_at: string | null;
}

const AdminPaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentGatewaySettings>({
    razorpay: { enabled: false, key_id: '', key_secret: '', test_mode: true },
    phonepe: { enabled: false, merchant_id: '', salt_key: '', salt_index: '', test_mode: true },
    paytm: { enabled: false, merchant_id: '', merchant_key: '', website: 'WEBSTAGING', industry_type: 'Retail', test_mode: true },
    cod: { enabled: true, min_amount: 0, max_amount: 50000 },
    updated_at: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    razorpay: false,
    phonepe: false,
    paytm: false,
  });
  
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await paymentSettingsAPI.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      addNotification('Failed to load payment settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await paymentSettingsAPI.updateSettings(settings);
      if (response.success) {
        setSettings(response.data);
        addNotification('Payment settings saved successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving payment settings:', error);
      addNotification(error.message || 'Failed to save payment settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleGateway = (gateway: 'razorpay' | 'phonepe' | 'paytm' | 'cod') => {
    setSettings(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        enabled: !prev[gateway].enabled,
      },
    }));
  };

  const updateField = (gateway: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [gateway]: {
        ...(prev as any)[gateway],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-maroon-600" />
                Payment Gateway Settings
              </h1>
              <p className="mt-2 text-gray-600">
                Configure payment gateways for your store. Enable/disable and manage API keys securely.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSettings}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </div>
          
          {settings.updated_at && (
            <p className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(settings.updated_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* Razorpay */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">R</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Razorpay</h2>
                    <p className="text-sm text-gray-500">Accept payments via UPI, Cards, Netbanking</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {settings.razorpay.test_mode && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Test Mode
                    </span>
                  )}
                  <button
                    onClick={() => toggleGateway('razorpay')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.razorpay.enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.razorpay.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-6 space-y-4 ${!settings.razorpay.enabled ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key ID
                  </label>
                  <input
                    type="text"
                    value={settings.razorpay.key_id || ''}
                    onChange={(e) => updateField('razorpay', 'key_id', e.target.value)}
                    placeholder="rzp_test_xxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.razorpay.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.razorpay ? 'text' : 'password'}
                      value={settings.razorpay.key_secret || ''}
                      onChange={(e) => updateField('razorpay', 'key_secret', e.target.value)}
                      placeholder="Enter secret key"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      disabled={!settings.razorpay.enabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(s => ({ ...s, razorpay: !s.razorpay }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.razorpay ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="razorpay_test_mode"
                  checked={settings.razorpay.test_mode}
                  onChange={(e) => updateField('razorpay', 'test_mode', e.target.checked)}
                  className="h-4 w-4 text-maroon-600 rounded border-gray-300"
                  disabled={!settings.razorpay.enabled}
                />
                <label htmlFor="razorpay_test_mode" className="text-sm text-gray-600">
                  Enable Test Mode (use sandbox environment)
                </label>
              </div>
            </div>
          </div>

          {/* PhonePe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">P</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">PhonePe</h2>
                    <p className="text-sm text-gray-500">Accept payments via PhonePe UPI</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {settings.phonepe.test_mode && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Test Mode
                    </span>
                  )}
                  <button
                    onClick={() => toggleGateway('phonepe')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.phonepe.enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.phonepe.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-6 space-y-4 ${!settings.phonepe.enabled ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={settings.phonepe.merchant_id || ''}
                    onChange={(e) => updateField('phonepe', 'merchant_id', e.target.value)}
                    placeholder="MERCHANTUAT"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.phonepe.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salt Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.phonepe ? 'text' : 'password'}
                      value={settings.phonepe.salt_key || ''}
                      onChange={(e) => updateField('phonepe', 'salt_key', e.target.value)}
                      placeholder="Enter salt key"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      disabled={!settings.phonepe.enabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(s => ({ ...s, phonepe: !s.phonepe }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.phonepe ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salt Index
                  </label>
                  <input
                    type="text"
                    value={settings.phonepe.salt_index || ''}
                    onChange={(e) => updateField('phonepe', 'salt_index', e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.phonepe.enabled}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="phonepe_test_mode"
                  checked={settings.phonepe.test_mode}
                  onChange={(e) => updateField('phonepe', 'test_mode', e.target.checked)}
                  className="h-4 w-4 text-maroon-600 rounded border-gray-300"
                  disabled={!settings.phonepe.enabled}
                />
                <label htmlFor="phonepe_test_mode" className="text-sm text-gray-600">
                  Enable Test Mode (use sandbox environment)
                </label>
              </div>
            </div>
          </div>

          {/* Paytm */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-600">P</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Paytm</h2>
                    <p className="text-sm text-gray-500">Accept payments via Paytm Wallet, UPI</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {settings.paytm.test_mode && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Test Mode
                    </span>
                  )}
                  <button
                    onClick={() => toggleGateway('paytm')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paytm.enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.paytm.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`p-6 space-y-4 ${!settings.paytm.enabled ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={settings.paytm.merchant_id || ''}
                    onChange={(e) => updateField('paytm', 'merchant_id', e.target.value)}
                    placeholder="YOUR_MERCHANT_ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.paytm.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant Key
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.paytm ? 'text' : 'password'}
                      value={settings.paytm.merchant_key || ''}
                      onChange={(e) => updateField('paytm', 'merchant_key', e.target.value)}
                      placeholder="Enter merchant key"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      disabled={!settings.paytm.enabled}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecrets(s => ({ ...s, paytm: !s.paytm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.paytm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <select
                    value={settings.paytm.website}
                    onChange={(e) => updateField('paytm', 'website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.paytm.enabled}
                  >
                    <option value="WEBSTAGING">WEBSTAGING (Test)</option>
                    <option value="DEFAULT">DEFAULT (Production)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Type
                  </label>
                  <input
                    type="text"
                    value={settings.paytm.industry_type}
                    onChange={(e) => updateField('paytm', 'industry_type', e.target.value)}
                    placeholder="Retail"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.paytm.enabled}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="paytm_test_mode"
                  checked={settings.paytm.test_mode}
                  onChange={(e) => updateField('paytm', 'test_mode', e.target.checked)}
                  className="h-4 w-4 text-maroon-600 rounded border-gray-300"
                  disabled={!settings.paytm.enabled}
                />
                <label htmlFor="paytm_test_mode" className="text-sm text-gray-600">
                  Enable Test Mode (use sandbox environment)
                </label>
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Cash on Delivery</h2>
                    <p className="text-sm text-gray-500">Allow customers to pay when they receive the order</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGateway('cod')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.cod.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.cod.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className={`p-6 space-y-4 ${!settings.cod.enabled ? 'opacity-50' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.cod.min_amount}
                    onChange={(e) => updateField('cod', 'min_amount', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.cod.enabled}
                  />
                  <p className="mt-1 text-xs text-gray-500">Set to 0 for no minimum</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.cod.max_amount}
                    onChange={(e) => updateField('cod', 'max_amount', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    disabled={!settings.cod.enabled}
                  />
                  <p className="mt-1 text-xs text-gray-500">Maximum allowed for COD orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Security Information</h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  <li>• All secret keys are encrypted before storage</li>
                  <li>• Secrets are never exposed to the frontend</li>
                  <li>• Use Test Mode during development and testing</li>
                  <li>• Switch to Production keys only when ready to go live</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentSettings;
