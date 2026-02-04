<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'url' => $this->image_url ?? $this->url ?? $this->path,
            'sort_order' => $this->sort_order,
            // Add other fields as needed
        ];
    }
}
