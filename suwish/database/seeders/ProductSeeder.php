<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get category IDs
        $banarasiCategory = Category::where('slug', 'banarasi')->first();
        $kanjeevaramCategory = Category::where('slug', 'kanjeevaram')->first();
        $cottonCategory = Category::where('slug', 'cotton')->first();
        $chiffonCategory = Category::where('slug', 'chiffon')->first();

        $products = [
            [
                'name' => 'Elegant Banarasi Silk Saree',
                'description' => 'A stunning Banarasi silk saree with intricate Zari work, perfect for weddings and festive occasions.',
                'price' => 4999.00,
                'sku' => 'BNS-001',
                'fabric' => 'Banarasi Silk',
                'color' => 'Maroon',
                'occasion' => 'Wedding',
                'work_type' => 'Zari',
                'image_url' => '/sarees/saree1.jpg',
                'image_urls' => '["/sarees/saree1_1.jpg", "/sarees/saree1_2.jpg", "/sarees/saree1_3.jpg"]',
                'care_instructions' => 'Dry clean only.',
                'blouse_included' => true,
                'drape_length' => 5.5,
                'rating' => 4.8,
                'review_count' => 120,
                'stock_quantity' => 10,
                'is_active' => true,
                'category_id' => $banarasiCategory->id,
            ],
            [
                'name' => 'Classic Kanjeevaram Saree',
                'description' => 'A timeless Kanjeevaram saree in a rich gold color, featuring beautiful embroidery.',
                'price' => 7999.00,
                'sku' => 'KNS-001',
                'fabric' => 'Kanjeevaram',
                'color' => 'Gold',
                'occasion' => 'Festive',
                'work_type' => 'Embroidery',
                'image_url' => '/sarees/saree2.jpg',
                'image_urls' => '["/sarees/saree2_1.jpg", "/sarees/saree2_2.jpg", "/sarees/saree2_3.jpg"]',
                'care_instructions' => 'Dry clean only.',
                'blouse_included' => true,
                'drape_length' => 5.5,
                'rating' => 4.9,
                'review_count' => 250,
                'stock_quantity' => 5,
                'is_active' => true,
                'category_id' => $kanjeevaramCategory->id,
            ],
            [
                'name' => 'Lightweight Chiffon Saree',
                'description' => 'A beautiful and lightweight chiffon saree, perfect for casual outings.',
                'price' => 1999.00,
                'sku' => 'CHS-001',
                'fabric' => 'Chiffon',
                'color' => 'Navy Blue',
                'occasion' => 'Casual',
                'work_type' => 'Printed',
                'image_url' => '/sarees/saree3.jpg',
                'image_urls' => '["/sarees/saree3_1.jpg", "/sarees/saree3_2.jpg", "/sarees/saree3_3.jpg"]',
                'care_instructions' => 'Hand wash separately.',
                'blouse_included' => true,
                'drape_length' => 5.5,
                'rating' => 4.5,
                'review_count' => 75,
                'stock_quantity' => 20,
                'is_active' => true,
                'category_id' => $chiffonCategory->id,
            ],
            [
                'name' => 'Pure Cotton Saree',
                'description' => 'A comfortable and elegant pure cotton saree, ideal for daily wear.',
                'price' => 1499.00,
                'sku' => 'PCS-001',
                'fabric' => 'Cotton',
                'color' => 'Cream',
                'occasion' => 'Daily Wear',
                'work_type' => 'Plain',
                'image_url' => '/sarees/saree4.jpg',
                'image_urls' => '["/sarees/saree4_1.jpg", "/sarees/saree4_2.jpg", "/sarees/saree4_3.jpg"]',
                'care_instructions' => 'Machine wash.',
                'blouse_included' => false,
                'drape_length' => 6.0,
                'rating' => 4.6,
                'review_count' => 90,
                'stock_quantity' => 15,
                'is_active' => true,
                'category_id' => $cottonCategory->id,
            ],
        ];

        foreach ($products as $productData) {
            // map legacy keys to current schema
            $payload = [
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'sku' => $productData['sku'],
                'fabric_type' => $productData['fabric'],
                'color' => $productData['color'],
                'occasion' => $productData['occasion'],
                'work_type' => $productData['work_type'],
                'image_url' => $productData['image_url'],
                'image_urls' => json_decode($productData['image_urls'], true),
                'care_instructions' => $productData['care_instructions'],
                'blouse_included' => $productData['blouse_included'],
                'drape_length' => $productData['drape_length'],
                'rating' => $productData['rating'],
                'review_count' => $productData['review_count'],
                'stock_quantity' => $productData['stock_quantity'],
                'status' => $productData['status'] ?? 'active',
            ];

            if (!Product::where('sku', $payload['sku'])->exists()) {
                $created = Product::create($payload);

                // attach first subcategory for the corresponding category if exists
                $categorySlug = null;
                if (strpos($payload['name'], 'Banarasi') !== false) $categorySlug = 'banarasi';
                if (strpos($payload['name'], 'Kanjeevaram') !== false) $categorySlug = 'kanjeevaram';
                if (strpos($payload['name'], 'Chiffon') !== false) $categorySlug = 'chiffon';
                if (strpos($payload['name'], 'Cotton') !== false) $categorySlug = 'cotton';

                if ($categorySlug) {
                    $cat = Category::where('slug', $categorySlug)->first();
                    if ($cat) {
                        $sub = $cat->subcategories()->first();
                        if ($sub) {
                            $created->subcategories()->attach($sub->id, ['is_primary' => 1]);
                        }
                    }
                }
            }
        }
    }
}