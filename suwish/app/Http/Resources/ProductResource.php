<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // Eager load images if not already loaded to prevent N+1 issues
        if (!$this->relationLoaded('images')) {
            $this->load('images');
        }

        $allImages = $this->images->map(function ($image) {
            return asset('storage/' . $image->image_url);
        })->toArray();

        // Separate main image and gallery images
        $mainImageUrl = $this->main_image_url;
        $galleryImages = collect($allImages)->filter(function ($url) use ($mainImageUrl) {
            return $url !== $mainImageUrl;
        })->values()->toArray();
        
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'sku' => $this->sku,
            'fabric' => $this->fabric,
            'color' => $this->color,
            'occasion' => $this->occasion,
            'workType' => $this->work_type,
            'imageUrl' => $mainImageUrl, // Use the accessor
            'imageUrls' => $galleryImages, // Use the remaining images as gallery
            'allImages' => $allImages, // Provide all images if needed
            'careInstructions' => $this->care_instructions,
            'blouseIncluded' => (bool) $this->blouse_included,
            'drapeLength' => (float) $this->drape_length,
            'rating' => (float) $this->rating,
            'reviewCount' => (int) $this->review_count,
            'stockQuantity' => (int) $this->stock_quantity,
            'isActive' => (bool) $this->is_active,
            'isFeatured' => (bool) $this->is_featured,
            'isTrending' => (bool) $this->is_trending,
            'isNewArrival' => (bool) $this->is_new_arrival,
            'isTopRated' => (bool) $this->is_top_rated,
            'isEthnicWear' => (bool) $this->is_ethnic_wear,
            'isSuwishCollection' => (bool) $this->is_suwish_collection,
            'categoryId' => (string) $this->category_id,
            'subcategoryId' => $this->subcategory_id ? (string) $this->subcategory_id : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'fabricType' => $this->fabric_type,
            'brand' => $this->brand,
            'discount' => (float) $this->discount,
            'colors' => $this->formatColorsForFrontend(),
            'defaultColor' => $this->color,
            'category' => $this->whenLoaded('category'),
            'subcategory' => $this->whenLoaded('subcategory'),
            'images' => ProductImageResource::collection($this->whenLoaded('images')), // Optionally use a dedicated resource for product images
            'variants' => $this->formatVariantsForFrontend(),
            'sizes' => $this->sizes, // Standalone sizes (without color variants)
            'final_price' => (float) $this->final_price,
        ];
    }
    
    private function formatColorsForFrontend()
    {
        $colors = $this->colors;
        
        if (!$colors || !is_array($colors)) {
            return [];
        }
        
        // Transform the colors to match the frontend structure
        $formattedColors = [];
        foreach ($colors as $color) {
            // Handle different possible formats of color data
            if (is_string($color)) {
                // If it's just a color name, create a basic structure
                $formattedColors[] = [
                    'id' => strtolower(str_replace(' ', '-', $color)),
                    'name' => $color,
                    'hexCode' => $this->getColorHexCode($color),
                    'images' => [
                        'main' => $this->main_image_url,
                        'gallery' => $this->images->where('color_code', null)->map(fn($image) => asset('storage/' . $image->image_url))->toArray(),
                        'thumbnails' => $this->images->where('color_code', null)->map(fn($image) => asset('storage/' . $image->image_url))->toArray(),
                    ]
                ];
            } elseif (is_array($color)) {
                // If it's already in the expected format
                $formattedColors[] = [
                    'id' => $color['id'] ?? strtolower(str_replace(' ', '-', $color['name'] ?? 'unknown')),
                    'name' => $color['name'] ?? 'Unknown',
                    'hexCode' => $color['hexCode'] ?? $this->getColorHexCode($color['name'] ?? ''),
                    'images' => $this->formatColorImagesForFrontend($color['images'] ?? [
                        'main' => $this->main_image_url,
                        'gallery' => $this->images->where('color_code', $color['id'] ?? null)->map(fn($image) => asset('storage/' . $image->image_url))->toArray(),
                        'thumbnails' => $this->images->where('color_code', $color['id'] ?? null)->map(fn($image) => asset('storage/' . $image->image_url))->toArray(),
                    ])
                ];
            }
        }
        
        return $formattedColors;
    }
    
    private function formatColorImagesForFrontend($colorImages)
    {
        $formattedImages = [
            'main' => null,
            'gallery' => [],
            'thumbnails' => [],
        ];
        
        // Process main image
        if (isset($colorImages['main'])) {
            $formattedImages['main'] = $colorImages['main'];
        }
        
        // Process gallery images
        if (isset($colorImages['gallery']) && is_array($colorImages['gallery'])) {
            $formattedImages['gallery'] = $colorImages['gallery'];
        }
        
        // Process thumbnail images
        if (isset($colorImages['thumbnails']) && is_array($colorImages['thumbnails'])) {
            $formattedImages['thumbnails'] = $colorImages['thumbnails'];
        }
        
        return $formattedImages;
    }
    
    private function getColorHexCode($colorName)
    {
        // Map common color names to hex codes
        $colorMap = [
            'red' => '#C41E3A',
            'blue' => '#4169E1',
            'green' => '#008000',
            'yellow' => '#FFD700',
            'purple' => '#800080',
            'orange' => '#FFA500',
            'pink' => '#FFC0CB',
            'black' => '#000000',
            'white' => '#FFFFFF',
            'gold' => '#D4AF37',
            'silver' => '#C0C0C0',
            'brown' => '#8B4513',
            'gray' => '#808080',
            'navy' => '#000080',
            'maroon' => '#800000',
        ];
        
        $normalizedColor = strtolower(trim($colorName));
        return $colorMap[$normalizedColor] ?? '#808080'; // Default to gray if not found
    }
    
    /**
     * Format variants for frontend with images grouped by color
     */
    private function formatVariantsForFrontend()
    {
        if (!$this->relationLoaded('variants')) {
            return [];
        }

        $variants = $this->variants->map(function ($variant) {
            // Get images for this specific color
            $colorImages = $this->images
                ->where('color_code', $variant->color_code)
                ->map(fn($image) => asset('storage/' . $image->image_url))
                ->values()
                ->toArray();

            return [
                'id' => $variant->id,
                'product_id' => $variant->product_id,
                'color_code' => $variant->color_code,
                'color_name' => $variant->color_name,
                'size' => $variant->size,
                'stock' => (int) $variant->stock,
                'price' => $variant->price ? (float) $variant->price : null, // Size-specific price override
                'price_adjustment' => $variant->price_adjustment ? (float) $variant->price_adjustment : 0,
                'images' => $colorImages, // Images for this color variant
            ];
        });

        return $variants;
    }
}
