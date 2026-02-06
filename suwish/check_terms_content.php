<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\StaticPage;

$page = StaticPage::where('slug', 'terms-and-conditions')->first();

if ($page) {
    echo "Slug: " . $page->slug . "\n";
    echo "Content Preview: " . substr($page->content, 0, 500) . "\n";
    echo "Has HTML tags: " . (strip_tags($page->content) !== $page->content ? 'Yes' : 'No') . "\n";
} else {
    echo "Page not found.\n";
}
