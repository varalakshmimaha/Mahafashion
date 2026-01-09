<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\StaticPage;

$pages = [
    [
        'name' => 'about-us',
        'title' => 'About Us',
        'content' => '<p>Welcome to <strong>Suwish</strong>, your one-stop destination for beautiful sarees and ethnic wear!</p>
        
        <h2>Our Story</h2>
        <p>We are passionate about bringing you the most beautiful and authentic sarees from all over India. Our mission is to provide you with a curated collection of high-quality sarees, from traditional handloom classics to modern designer creations.</p>
        
        <h2>Our Commitment</h2>
        <p>We work directly with weavers and artisans to ensure that every saree we sell is a masterpiece of craftsmanship. Each piece is carefully selected to meet our high standards of quality and authenticity.</p>
        
        <p>Thank you for choosing us for your saree shopping needs. We hope you find the perfect saree that makes you look and feel your best.</p>',
        'sort_order' => 1,
    ],
    [
        'name' => 'contact-us',
        'title' => 'Contact Us',
        'content' => '<p>We would love to hear from you! For any questions, concerns, or feedback, please reach out to us:</p>
        
        <h3>Email</h3>
        <p>contact@suwish.com</p>
        
        <h3>Phone</h3>
        <p>+91 1234567890</p>
        
        <h3>Business Hours</h3>
        <p>Monday - Saturday: 9:00 AM - 6:00 PM<br>
        Sunday: Closed</p>',
        'sort_order' => 2,
    ],
    [
        'name' => 'shipping-and-returns',
        'title' => 'Shipping & Returns',
        'content' => '<h2>Shipping Information</h2>
        <p>We offer fast and reliable shipping across India.</p>
        
        <h3>Free Shipping</h3>
        <p>Free shipping on orders above ₹999</p>
        
        <h3>Standard Shipping</h3>
        <p>₹99 for orders below ₹999<br>
        Delivery in 5-7 business days</p>
        
        <h3>Express Shipping</h3>
        <p>₹199 flat rate<br>
        Delivery in 2-3 business days</p>
        
        <h2>Returns Policy</h2>
        <p>We want you to be completely satisfied with your purchase. If for any reason you are not happy, you can return the item within 7 days of delivery.</p>
        
        <h3>Return Conditions</h3>
        <ul>
            <li>Item must be unused and in original packaging</li>
            <li>Tags must be attached</li>
            <li>Return shipping charges apply</li>
        </ul>',
        'sort_order' => 3,
    ],
    [
        'name' => 'terms-and-conditions',
        'title' => 'Terms & Conditions',
        'content' => '<p>Please read these terms and conditions carefully before using our website.</p>
        
        <h2>1. Introduction</h2>
        <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Suwish accessible at www.suwish.com.</p>
        
        <h2>2. Intellectual Property Rights</h2>
        <p>Other than the content you own, under these Terms, Suwish and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
        
        <h2>3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
            <li>Publishing any Website material in any other media</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
            <li>Publicly performing and/or showing any Website material</li>
            <li>Using this Website in any way that is or may be damaging to this Website</li>
        </ul>
        
        <h2>4. Your Privacy</h2>
        <p>Please read our Privacy Policy for information on how we collect and use your personal data.</p>',
        'sort_order' => 4,
    ],
    [
        'name' => 'privacy-policy',
        'title' => 'Privacy Policy',
        'content' => '<p>At Suwish, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
        
        <h2>Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
            <li>Name, email address, phone number</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information</li>
            <li>Order history</li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <ul>
            <li>Process and fulfill your orders</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your questions and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
        </ul>
        
        <h2>Information Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@suwish.com</p>',
        'sort_order' => 5,
    ],
];

echo "Seeding static pages...\n\n";

foreach ($pages as $pageData) {
    $page = StaticPage::updateOrCreate(
        ['name' => $pageData['name']],
        $pageData
    );
    echo "✓ Created/Updated: {$page->title} ({$page->name})\n";
}

echo "\nStatic pages seeded successfully!\n";
echo "\nAvailable pages:\n";
foreach ($pages as $pageData) {
    echo "- {$pageData['name']}: http://localhost:8000/api/static-pages/{$pageData['name']}\n";
}
