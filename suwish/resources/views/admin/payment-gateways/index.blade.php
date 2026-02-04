@extends('admin.layouts.app')

@section('title', 'Payment Gateways')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Payment Gateways</h1>
    <p class="text-gray-600">Configure and manage payment methods for your store</p>
</div>

<div class="bg-white rounded-lg shadow overflow-hidden">
    @foreach($gateways as $gateway)
    <div class="border-b border-gray-200 last:border-b-0">
        <div class="p-6 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ $gateway->display_name }}</h3>
                <p class="text-sm text-gray-600 capitalize">{{ $gateway->name }}</p>
            </div>
            
            <div class="flex items-center space-x-4">
                <span class="text-sm font-medium {{ $gateway->is_enabled ? 'text-green-600' : 'text-red-600' }}">
                    {{ $gateway->is_enabled ? 'Enabled' : 'Disabled' }}
                </span>
                
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" 
                           class="sr-only peer" 
                           data-gateway-id="{{ $gateway->id }}"
                           {{ $gateway->is_enabled ? 'checked' : '' }}>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
        
        <div class="px-6 pb-6">
            @if($gateway->name === 'razorpay')
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Razorpay Key ID"
                               value="{{ $gateway->masked_config['key_id'] ?? '' }}"
                               data-field="key_id"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Key Secret</label>
                        <input type="password" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Razorpay Key Secret"
                               value="{{ $gateway->masked_config['key_secret'] ?? '' }}"
                               data-field="key_secret"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                        <input type="password" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Razorpay Webhook Secret"
                               value="{{ $gateway->masked_config['webhook_secret'] ?? '' }}"
                               data-field="webhook_secret"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                data-field="mode"
                                data-gateway="{{ $gateway->id }}">
                            <option value="test" {{ ($gateway->masked_config['mode'] ?? 'test') == 'test' ? 'selected' : '' }}>Test</option>
                            <option value="live" {{ ($gateway->masked_config['mode'] ?? 'test') == 'live' ? 'selected' : '' }}>Live</option>
                        </select>
                    </div>
                </div>
            @elseif($gateway->name === 'phonepe')
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter PhonePe Merchant ID"
                               value="{{ $gateway->masked_config['merchant_id'] ?? '' }}"
                               data-field="merchant_id"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Salt Key</label>
                        <input type="password" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter PhonePe Salt Key"
                               value="{{ $gateway->masked_config['salt_key'] ?? '' }}"
                               data-field="salt_key"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Salt Index</label>
                        <input type="number" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Salt Index"
                               value="{{ $gateway->masked_config['salt_index'] ?? 1 }}"
                               data-field="salt_index"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                data-field="environment"
                                data-gateway="{{ $gateway->id }}">
                            <option value="uat" {{ ($gateway->masked_config['environment'] ?? 'UAT') == 'uat' ? 'selected' : '' }}>UAT</option>
                            <option value="production" {{ ($gateway->masked_config['environment'] ?? 'UAT') == 'production' ? 'selected' : '' }}>Production</option>
                        </select>
                    </div>
                </div>
            @elseif($gateway->name === 'paytm')
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Paytm Merchant ID"
                               value="{{ $gateway->masked_config['merchant_id'] ?? '' }}"
                               data-field="merchant_id"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Merchant Key</label>
                        <input type="password" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Paytm Merchant Key"
                               value="{{ $gateway->masked_config['merchant_key'] ?? '' }}"
                               data-field="merchant_key"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Website Name"
                               value="{{ $gateway->masked_config['website_name'] ?? 'WEBSTAGING' }}"
                               data-field="website_name"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Enter Industry Type"
                               value="{{ $gateway->masked_config['industry_type'] ?? 'Retail' }}"
                               data-field="industry_type"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                data-field="environment"
                                data-gateway="{{ $gateway->id }}">
                            <option value="staging" {{ ($gateway->masked_config['environment'] ?? 'Staging') == 'staging' ? 'selected' : '' }}>Staging</option>
                            <option value="production" {{ ($gateway->masked_config['environment'] ?? 'Staging') == 'production' ? 'selected' : '' }}>Production</option>
                        </select>
                    </div>
                </div>
            @elseif($gateway->name === 'cod')
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Order Amount</label>
                        <input type="number" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Maximum order amount (optional)"
                               value="{{ $gateway->masked_config['max_order_amount'] ?? '' }}"
                               data-field="max_order_amount"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                        <input type="number" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Minimum order amount (optional)"
                               value="{{ $gateway->masked_config['min_order_amount'] ?? '' }}"
                               data-field="min_order_amount"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">COD Charges</label>
                        <input type="number" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="COD charges (optional)"
                               value="{{ $gateway->masked_config['cod_charges'] ?? '' }}"
                               data-field="cod_charges"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Allow for Pincodes</label>
                        <input type="text" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                               placeholder="Comma separated pincodes (optional)"
                               value="{{ $gateway->masked_config['allow_pincodes'] ?? '' }}"
                               data-field="allow_pincodes"
                               data-gateway="{{ $gateway->id }}">
                    </div>
                </div>
            @endif
            
            <div class="flex justify-end">
                <button class="save-config-btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md" 
                        data-gateway="{{ $gateway->id }}">
                    Save Configuration
                </button>
            </div>
        </div>
    </div>
    @endforeach
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Helper to get CSRF token safely
    const getCsrfToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (!meta) {
            console.error('CSRF token meta tag not found');
            alert('Security Error: CSRF token missing. Please refresh the page.');
            throw new Error('CSRF token missing');
        }
        return meta.getAttribute('content');
    };

    // Handle toggle switches
    const toggleSwitches = document.querySelectorAll('input[type="checkbox"][data-gateway-id]');
    toggleSwitches.forEach(switchElement => {
        switchElement.addEventListener('change', function(e) {
            const gatewayId = e.currentTarget.getAttribute('data-gateway-id');
            const isChecked = e.currentTarget.checked;
            const action = isChecked ? 'enable' : 'disable';
            
            fetch(`/admin/payment-gateways/${gatewayId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Accept': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(async response => {
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update status');
                }
                return data;
            })
            .then(data => {
                // Success - optional toast could go here
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: ' + error.message);
                e.currentTarget.checked = !isChecked; // Revert the switch
            });
        });
    });
    
    // Handle save configuration buttons
    const saveButtons = document.querySelectorAll('.save-config-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const btn = e.currentTarget;
            const gatewayId = btn.getAttribute('data-gateway');
            const inputs = document.querySelectorAll(`[data-gateway="${gatewayId}"][data-field]`);
            
            const configData = {};
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                if (input.type === 'checkbox') {
                    configData[fieldName] = input.checked;
                } else {
                    configData[fieldName] = input.value;
                }
            });

            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;
            
            fetch(`/admin/payment-gateways/${gatewayId}/update-config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Accept': 'application/json'
                },
                body: JSON.stringify(configData)
            })
            .then(async response => {
                const data = await response.json().catch(() => ({}));
                
                if (!response.ok) {
                    // Handle Validation Errors (422) specifically
                    if (response.status === 422) {
                        let errorMsg = 'Validation Failed:\n';
                        if (data.errors) {
                            for (const [field, messages] of Object.entries(data.errors)) {
                                errorMsg += `\n• ${messages.join(', ')}`;
                            }
                        } else {
                            errorMsg += `\n${data.message || 'Check your input.'}`;
                        }
                        throw new Error(errorMsg);
                    }
                    throw new Error(data.message || 'Failed to save configuration');
                }
                return data;
            })
            .then(data => {
                alert(data.message || 'Configuration saved successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            })
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    });
});
</script>
@endsection