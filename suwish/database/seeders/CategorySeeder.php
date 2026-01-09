<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name' => 'Banarasi',
                'slug' => 'banarasi',
                'description' => 'Traditional Banarasi silk sarees with intricate zari work',
                'image' => '/sarees/saree1.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Kanjeevaram',
                'slug' => 'kanjeevaram',
                'description' => 'Rich and traditional Kanchipuram silk sarees',
                'image' => '/sarees/saree2.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Silk',
                'slug' => 'silk',
                'description' => 'Luxurious silk sarees for special occasions',
                'image' => '/sarees/saree3.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Chiffon',
                'slug' => 'chiffon',
                'description' => 'Lightweight and elegant chiffon sarees',
                'image' => '/sarees/saree4.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Cotton',
                'slug' => 'cotton',
                'description' => 'Comfortable and breathable cotton sarees for daily wear',
                'image' => '/sarees/saree1.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Georgette',
                'slug' => 'georgette',
                'description' => 'Flowy and comfortable georgette sarees',
                'image' => '/categories/georgette.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            // Check if category with this slug already exists
            if (!Category::where('slug', $category['slug'])->exists()) {
                Category::create($category);
            }
        }
    }
}