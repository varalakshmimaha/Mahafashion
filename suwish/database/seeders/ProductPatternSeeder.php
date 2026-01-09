<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductPattern;

class ProductPatternSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample product patterns
        $patterns = [
            [
                'pattern_name' => 'Kanchipuram Silk - Peacock Motif',
                'pattern_code' => 'KANCHI-PEACOCK',
                'description' => 'Traditional Kanchipuram silk saree with peacock motif design'
            ],
            [
                'pattern_name' => 'Banarasi Brocade - Floral',
                'pattern_code' => 'BANARASI-FLOWER',
                'description' => 'Classic Banarasi brocade saree with floral patterns'
            ],
            [
                'pattern_name' => 'Chiffon - Contemporary',
                'pattern_code' => 'CHIFFON-COTEMP',
                'description' => 'Modern chiffon saree with contemporary designs'
            ],
            [
                'pattern_name' => 'Cotton Handloom - Traditional',
                'pattern_code' => 'COTTON-TRAD',
                'description' => 'Traditional cotton handloom saree'
            ],
            [
                'pattern_name' => 'Tissue Silk - Bridal',
                'pattern_code' => 'TISSUE-BRIDL',
                'description' => 'Luxurious tissue silk saree for bridal wear'
            ]
        ];

        foreach ($patterns as $pattern) {
            ProductPattern::firstOrCreate(
                ['pattern_code' => $pattern['pattern_code']],
                $pattern
            );
        }
    }
}