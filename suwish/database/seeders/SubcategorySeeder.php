<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subcategory;
use App\Models\Category;

class SubcategorySeeder extends Seeder
{
    public function run()
    {
        $map = [
            'banarasi' => [
                ['name' => 'Banarasi Silk', 'slug' => 'banarasi-silk'],
                ['name' => 'Banarasi Cotton', 'slug' => 'banarasi-cotton'],
            ],
            'kanjeevaram' => [
                ['name' => 'Kanchipuram Pure Silk', 'slug' => 'kanchipuram-pure-silk'],
                ['name' => 'Kanchipuram Blend', 'slug' => 'kanchipuram-blend'],
            ],
            'silk' => [
                ['name' => 'Art Silk', 'slug' => 'art-silk'],
            ],
            'chiffon' => [
                ['name' => 'Plain Chiffon', 'slug' => 'plain-chiffon'],
            ],
            'cotton' => [
                ['name' => 'Handloom Cotton', 'slug' => 'handloom-cotton'],
            ],
            'georgette' => [
                ['name' => 'Designer Georgette', 'slug' => 'designer-georgette'],
            ],
        ];

        foreach ($map as $categorySlug => $subs) {
            $category = Category::where('slug', $categorySlug)->first();
            if (!$category) continue;
            foreach ($subs as $s) {
                Subcategory::updateOrCreate(
                    ['slug' => $s['slug']],
                    [
                        'name' => $s['name'],
                        'category_id' => $category->id,
                        'is_active' => 1,
                    ]
                );
            }
        }
    }
}
