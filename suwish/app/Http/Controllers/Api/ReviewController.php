<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = \App\Models\Review::with('user:id,name')
            ->where('product_id', $productId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
            'images.*' => 'nullable|image|max:2048',
            'videos.*' => 'nullable|mimes:mp4,mov,ogg,qt|max:20000' // Max 20MB video
        ]);

        $user = \Illuminate\Support\Facades\Auth::user();
        
        // strict "After Delivery" check
        $eligibleOrder = \App\Models\Order::where('user_id', $user->id)
            ->where('status', 'delivered') // Assuming "delivered" is stored lowercase. If mixed case issues, beware.
            ->whereHas('orderItems', function($query) use ($request) {
                $query->where('product_id', $request->product_id);
            })
            ->latest() // Get most recent purchase if multiple
            ->first();

        if (!$eligibleOrder) {
            // For testing purposes, we might relax this if you are stuck, but strictly speaking this is the requirement.
            // If the user manually changes status to DELIVERED (uppercase) but code checks 'delivered' (lowercase),
            // this might fail. Let's make it robust:
            // ->whereRaw('LOWER(status) = ?', ['delivered']) 
            // However, Laravel Eloquent isn't case sensitive on MySQL usually, but let's stick to standard practice.
            
            // Check again without status constraint to give better error message?
            $anyOrder = \App\Models\Order::where('user_id', $user->id)
                ->whereHas('orderItems', function($q) use ($request) {
                    $q->where('product_id', $request->product_id);
                })->first();

            if (!$anyOrder) {
                return response()->json(['message' => 'You must purchase this product to review it.'], 403);
            }
             
            return response()->json([
                'message' => 'You can only review products after they have been delivered.'
            ], 403);
        }

        // Handle Images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = asset('storage/' . $path);
            }
        }

        // Handle Videos
        $videoPaths = [];
        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $path = $video->store('reviews/videos', 'public');
                $videoPaths[] = asset('storage/' . $path);
            }
        }

        $review = \App\Models\Review::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'order_id' => $eligibleOrder->id,
            'rating' => $request->rating,
            'review' => $request->review,
            'images' => $imagePaths,
            'videos' => $videoPaths,
            'status' => 'approved', // Auto-approve
            'is_verified_purchase' => true
        ]);
        
        // Update Product aggregate rating
        $this->updateProductRating($request->product_id);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    private function updateProductRating($productId)
    {
        $product = \App\Models\Product::find($productId);
        $avg = $product->reviews()->where('status', 'approved')->avg('rating');
        $count = $product->reviews()->where('status', 'approved')->count();
        
        $product->update([
            'rating' => round($avg, 1),
            'review_count' => $count
        ]);
    }
}
