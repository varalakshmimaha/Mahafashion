<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingSetting;

class ShippingSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $settings = [
            [
                'key' => 'shipping_fee',
                'value' => '99',
                'description' => 'Standard shipping fee for orders below threshold'
            ],
            [
                'key' => 'free_shipping_threshold',
                'value' => '1000',
                'description' => 'Orders above this amount get free shipping'
            ],
            [
                'key' => 'express_delivery_label',
                'value' => 'Express Delivery',
                'description' => 'Title for the express delivery option'
            ],
            [
                'key' => 'express_delivery_subtitle',
                'value' => 'Ships in 24-48 hours',
                'description' => 'Subtitle description for express delivery'
            ],
            [
                'key' => 'standard_delivery_label',
                'value' => 'Standard Delivery',
                'description' => 'Title for standard delivery'
            ],
            [
                'key' => 'standard_delivery_subtitle',
                'value' => 'Delivery in 5-7 business days',
                'description' => 'Subtitle for standard delivery'
            ]
        ];

        foreach ($settings as $setting) {
            ShippingSetting::firstOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'description' => $setting['description']
                ]
            );
        }
    }
}
