<?php

use Illuminate\Support\Facades\Route;
use App\Models\Order;

// Temporary debug route - remove before production
Route::get('debug/order/{id}', function($id) {
    try {
        $order = Order::with(['orderItems.product'])->find($id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        
        $items = [];
        foreach ($order->orderItems as $oi) {
            $items[] = [
                'id' => $oi->id,
                'product_id' => $oi->product_id,
                'product_name' => $oi->product->name ?? 'N/A',
                'price' => $oi->price,
                'quantity' => $oi->quantity,
            ];
        }
        
        return response()->json([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'total' => $order->total,
            'subtotal' => $order->subtotal,
            'items_count' => count($items),
            'items' => $items,
            'debug' => [
                'orderItems_relationship_count' => $order->orderItems->count(),
                'direct_query_count' => \DB::table('order_items')->where('order_id', $id)->count(),
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});
