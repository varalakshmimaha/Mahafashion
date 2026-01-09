<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Http;

try {
    $response = Http::get('http://127.0.0.1:8000/api/categories-with-subcategories');
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}