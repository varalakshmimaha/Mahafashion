<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'imageUrl' => $this->getImageUrlForFrontend(),
            'imageUrls' => $this->getImageUrlsForFrontend(),
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
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'fabricType' => $this->fabric_type,
            'brand' => $this->brand,
            'discount' => (float) $this->discount,
            'colors' => $this->formatColorsForFrontend(),
            'defaultColor' => $this->color,
            'category' => $this->whenLoaded('category'),
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
                        'main' => $this->getImageUrlForFrontend(),
                        'gallery' => $this->getImageUrlsForFrontend(),
                        'thumbnails' => $this->getImageUrlsForFrontend(),
                    ]
                ];
            } elseif (is_array($color)) {
                // If it's already in the expected format
                $formattedColors[] = [
                    'id' => $color['id'] ?? strtolower(str_replace(' ', '-', $color['name'] ?? 'unknown')),
                    'name' => $color['name'] ?? 'Unknown',
                    'hexCode' => $color['hexCode'] ?? $this->getColorHexCode($color['name'] ?? ''),
                    'images' => $this->formatColorImagesForFrontend($color['images'] ?? [
                        'main' => $this->getImageUrlForFrontend(),
                        'gallery' => $this->getImageUrlsForFrontend(),
                        'thumbnails' => $this->getImageUrlsForFrontend(),
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
            if (str_starts_with($colorImages['main'], '/')) {
                $formattedImages['main'] = asset($colorImages['main']);
            } else {
                $formattedImages['main'] = asset('storage/' . $colorImages['main']);
            }
        }
        
        // Process gallery images
        if (isset($colorImages['gallery']) && is_array($colorImages['gallery'])) {
            foreach ($colorImages['gallery'] as $galleryImage) {
                if (str_starts_with($galleryImage, '/')) {
                    $formattedImages['gallery'][] = asset($galleryImage);
                } else {
                    $formattedImages['gallery'][] = asset('storage/' . $galleryImage);
                }
            }
        }
        
        // Process thumbnail images
        if (isset($colorImages['thumbnails']) && is_array($colorImages['thumbnails'])) {
            foreach ($colorImages['thumbnails'] as $thumbnailImage) {
                if (str_starts_with($thumbnailImage, '/')) {
                    $formattedImages['thumbnails'][] = asset($thumbnailImage);
                } else {
                    $formattedImages['thumbnails'][] = asset('storage/' . $thumbnailImage);
                }
            }
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
    
    private function getImageUrlForFrontend()
    {
        if (!$this->image_url) {
            return null;
        }
        
        // Check if the image path is already an absolute path (starts with /)
        if (str_starts_with($this->image_url, '/')) {
            return asset($this->image_url);
        } else {
            // It's a storage path, prepend storage/
            return asset('storage/' . $this->image_url);
        }
    }
    
    private function getImageUrlsForFrontend()
    {
        $imageUrls = $this->image_urls ?? [];
        
        if (!is_array($imageUrls)) {
            return [];
        }
        
        return array_map(function($url) {
            // Check if the image path is already an absolute path (starts with /)
            if (str_starts_with($url, '/')) {
                return asset($url);
            } else {
                // It's a storage path, prepend storage/
                return asset('storage/' . $url);
            }
        }, $imageUrls);
    }
}
