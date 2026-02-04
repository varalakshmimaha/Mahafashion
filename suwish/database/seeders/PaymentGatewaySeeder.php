<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentGateway;

class PaymentGatewaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gateways = [
            [
                'name' => 'razorpay',
                'display_name' => 'Razorpay',
                'is_enabled' => false,
                'config' => json_encode([
                    'key_id' => null,
                    'key_secret' => null,
                    'webhook_secret' => null,
                    'mode' => 'test',
                ]),
            ],
            [
                'name' => 'phonepe',
                'display_name' => 'PhonePe',
                'is_enabled' => false,
                'config' => json_encode([
                    'merchant_id' => null,
                    'salt_key' => null,
                    'salt_index' => 1,
                    'environment' => 'UAT',
                ]),
            ],
            [
                'name' => 'paytm',
                'display_name' => 'Paytm',
                'is_enabled' => false,
                'config' => json_encode([
                    'merchant_id' => null,
                    'merchant_key' => null,
                    'website_name' => 'WEBSTAGING', // Default value
                    'industry_type' => 'Retail', // Default value
                    'environment' => 'Staging',
                ]),
            ],
            [
                'name' => 'cod',
                'display_name' => 'Cash on Delivery',
                'is_enabled' => true, // COD can be enabled by default
                'config' => json_encode([
                    'max_order_amount' => null,
                    'min_order_amount' => null,
                    'cod_charges' => null,
                    'allow_pincodes' => null,
                ]),
            ],
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(
                ['name' => $gateway['name']],
                [
                    'display_name' => $gateway['display_name'],
                    'is_enabled' => $gateway['is_enabled'],
                    // The setConfigAttribute mutator will handle encryption
                    'config' => json_decode($gateway['config'], true),
                ]
            );
        }
    }
}
