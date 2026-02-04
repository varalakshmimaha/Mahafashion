<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Offer;
use Carbon\Carbon;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing offers
        Offer::truncate();

        $offers = [
            [
                'title' => 'Shivaratri Special Sale',
                'subtitle' => 'Divine Silk Collection',
                'description' => 'Celebrate Maha Shivaratri with our exclusive collection of traditional silk sarees',
                'button_text' => 'Shop Now',
                'button_link' => '/products?category=silk',
                'discount_text' => 'Up to 50% OFF',
                'start_date' => Carbon::now()->subDays(5),
                'end_date' => Carbon::now()->addDays(10),
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'New Arrivals',
                'subtitle' => 'Fresh Designs Just In',
                'description' => 'Discover our latest collection of handpicked sarees',
                'button_text' => 'Explore Collection',
                'button_link' => '/products/new-arrivals',
                'discount_text' => 'Flat 30% OFF',
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(30),
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Festive Season Sale',
                'subtitle' => 'Traditional Elegance',
                'description' => 'Get ready for the upcoming festivals with our stunning saree collection',
                'button_text' => 'View Offers',
                'button_link' => '/products',
                'discount_text' => 'Save up to 40%',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(15),
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Wedding Special',
                'subtitle' => 'Bridal Collection 2026',
                'description' => 'Exquisite Kanjeevaram and Banarasi sarees for your special day',
                'button_text' => 'Browse Collection',
                'button_link' => '/products?category=kanjeevaram',
                'discount_text' => 'Premium Designs',
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addMonths(2),
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($offers as $offer) {
            Offer::create($offer);
        }
    }
}
