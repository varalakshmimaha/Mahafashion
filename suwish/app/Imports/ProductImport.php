<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Row;

class ProductImport implements OnEachRow, WithHeadingRow, WithValidation, SkipsOnError, WithChunkReading
{
    use SkipsErrors;

    /**
     * @param \Maatwebsite\Excel\Row $row
     */
    public function onRow(\Maatwebsite\Excel\Row $row)
    {
        $rowIndex = $row->getIndex();
        $row      = $row->toArray();

        // Find or create category
        $category = null;
        if (!empty($row['category'])) {
            $category = Category::firstOrCreate(
                ['name' => $row['category']],
                ['slug' => \Str::slug($row['category'])]
            );
        }

        // Find or create subcategory
        $subcategory = null;
        if (!empty($row['subcategory']) && $category) {
            $subcategory = Subcategory::firstOrCreate(
                [
                    'name' => $row['subcategory'],
                    'category_id' => $category->id
                ],
                ['slug' => \Str::slug($row['subcategory'])]
            );
        }

        $product = Product::create([
            'sku' => $row['sku'] ?? 'SKU-' . \Str::random(10),
            'name' => $row['name'],
            'description' => $row['description'] ?? '',
            'category_id' => $category ? $category->id : null,
            'subcategory_id' => $subcategory ? $subcategory->id : null,
            'price' => $row['price'] ?? 0,
            'discount' => $row['discount'] ?? 0,
            'stock_quantity' => $row['stock_quantity'] ?? 0,
            'status' => $row['status'] ?? 'active',
            'fabric_type' => $row['fabric_type'] ?? null,
            'brand' => $row['brand'] ?? null,
            'color' => $row['color'] ?? null,
            'package_contains' => $row['package_contains'] ?? null,
            'fit' => $row['fit'] ?? null,
            'origin' => $row['origin'] ?? null,
            'is_trending' => $this->convertToBoolean($row['is_trending'] ?? 'No'),
            'is_new_arrival' => $this->convertToBoolean($row['is_new_arrival'] ?? 'No'),
            'is_ethnic_wear' => $this->convertToBoolean($row['is_ethnic_wear'] ?? 'No'),
            'is_suwish_collection' => $this->convertToBoolean($row['is_suwish_collection'] ?? 'No'),
        ]);

        // Handle Images
        if (!empty($row['image_urls'])) {
            $urls = explode(',', $row['image_urls']);
            foreach ($urls as $index => $url) {
                $url = trim($url);
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    try {
                        // Download image
                        $contents = @file_get_contents($url);
                        if ($contents) {
                            $name = basename(parse_url($url, PHP_URL_PATH));
                            if (!$name) $name = 'image.jpg';
                            
                            $filename = 'products/' . \Str::random(10) . '_' . $name;
                            \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $contents);
                            
                            \App\Models\ProductImage::create([
                                'product_id' => $product->id,
                                'image_url' => $filename,
                                'sort_order' => $index,
                                'is_default' => $index === 0, // First image is default
                                'color_code' => null
                            ]);
                        }
                    } catch (\Exception $e) {
                        // Log error or continue
                        \Illuminate\Support\Facades\Log::error("Failed to download image for SKU {$product->sku}: " . $e->getMessage());
                    }
                }
            }
        }
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'stock_quantity' => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ];
    }

    /**
     * @return int
     */
    public function chunkSize(): int
    {
        return 100;
    }

    /**
     * Convert string to boolean
     *
     * @param mixed $value
     * @return bool
     */
    private function convertToBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $value = strtolower(trim($value));
        return in_array($value, ['yes', '1', 'true', 'on']);
    }
}
