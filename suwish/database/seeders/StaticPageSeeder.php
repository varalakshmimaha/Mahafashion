<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StaticPage; // Make sure to create this model if it doesn't exist

class StaticPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // About Us Page
        StaticPage::firstOrCreate(
            ['name' => 'about-us'],
            [
                'title' => 'About Us',
                'content' => '<h1>Welcome to Suwish!</h1><p>We are passionate about bringing you the most beautiful and authentic sarees from all over India. Our mission is to provide you with a curated collection of high-quality sarees, from traditional handloom classics to modern designer creations. We work directly with weavers and artisans to ensure that every saree we sell is a masterpiece of craftsmanship. Thank you for choosing us for your saree shopping needs. We hope you find the perfect saree that makes you look and feel your best.</p>',
                'slug' => 'about-us',
                'meta_title' => 'About Suwish',
                'meta_description' => 'Learn more about Suwish, your trusted source for exquisite sarees.',
                'status' => 'published',
                'sort_order' => 10,
            ]
        );

        // Contact Us Page
        StaticPage::firstOrCreate(
            ['name' => 'contact-us'],
            [
                'title' => 'Contact Us',
                'content' => '<h1>Get in Touch</h1><p>Have questions, feedback, or need assistance? We\'d love to hear from you!</p><p><strong>Email:</strong> support@suwish.com</p><p><strong>Phone:</strong> +91 12345 67890</p><p><strong>Address:</strong> 123 Saree Lane, Textile City, India</p>',
                'slug' => 'contact-us',
                'meta_title' => 'Contact Suwish',
                'meta_description' => 'Contact Suwish for support, feedback, or inquiries.',
                'status' => 'published',
                'sort_order' => 20,
            ]
        );

        // Shipping & Returns Page
        StaticPage::firstOrCreate(
            ['name' => 'shipping-and-returns'],
            [
                'title' => 'Shipping & Returns',
                'content' => '<h1>Shipping & Returns Policy</h1><p><strong>Shipping:</strong> We offer reliable shipping across India. Orders are typically processed within 2-3 business days and delivered within 5-7 business days.</p><p><strong>Returns:</strong> We accept returns within 7 days of delivery for unworn and unwashed items. Please refer to our full policy for more details.</p>',
                'slug' => 'shipping-and-returns',
                'meta_title' => 'Suwish Shipping & Returns',
                'meta_description' => 'Information on shipping and return policies for Suwish orders.',
                'status' => 'published',
                'sort_order' => 30,
            ]
        );

        // Terms & Conditions Page
        StaticPage::firstOrCreate(
            ['name' => 'terms-and-conditions'],
            [
                'title' => 'Terms & Conditions',
                'content' => '<h1>Terms & Conditions</h1><p>By using the Suwish website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p><p>[Placeholder for detailed terms and conditions]</p>',
                'slug' => 'terms-and-conditions',
                'meta_title' => 'Suwish Terms & Conditions',
                'meta_description' => 'Read the terms and conditions for using the Suwish e-commerce platform.',
                'status' => 'published',
                'sort_order' => 40,
            ]
        );

        // Privacy Policy Page
        StaticPage::firstOrCreate(
            ['name' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'content' => '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p><p>[Placeholder for detailed privacy policy]</p>',
                'slug' => 'privacy-policy',
                'meta_title' => 'Suwish Privacy Policy',
                'meta_description' => 'Understand how Suwish collects, uses, and protects your personal data.',
                'status' => 'published',
                'sort_order' => 50,
            ]
        );
    }
}
