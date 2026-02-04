<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class TestOrderItems extends Command
{
    protected $signature = 'test:order-items {order_id}';
    protected $description = 'Test if order items are loading correctly';

    public function handle()
    {
        $orderId = $this->argument('order_id');
        
        $this->info("Testing Order #{$orderId}...");
        $this->newLine();
        
        // Test 1: Check if order exists
        $order = Order::find($orderId);
        if (!$order) {
            $this->error("❌ Order #{$orderId} not found!");
            return 1;
        }
        $this->info("✓ Order exists");
        $this->line("  Order Number: {$order->order_number}");
        $this->line("  User ID: " . ($order->user_id ?? 'null (guest)'));
        $this->line("  Total: ₹{$order->total}");
        $this->newLine();
        
        // Test 2: Check order items relationship
        $this->info("Testing orderItems relationship...");
        $itemCount = $order->orderItems()->count();
        $this->line("  OrderItems count: {$itemCount}");
        
        if ($itemCount === 0) {
            $this->error("❌ No order items found!");
            
            // Check if items exist in table
            $directCount = OrderItem::where('order_id', $orderId)->count();
            $this->line("  Direct query count: {$directCount}");
            
            if ($directCount > 0) {
                $this->error("⚠️  Items exist but relationship is broken!");
            }
            return 1;
        }
        
        $this->info("✓ Found {$itemCount} order item(s)");
        $this->newLine();
        
        // Test 3: Eager load and display items
        $orderWithItems = Order::with(['orderItems.product'])->find($orderId);
        
        $this->info("Order Items Details:");
        $this->newLine();
        
        foreach ($orderWithItems->orderItems as $index => $item) {
            $this->line("  Item #" . ($index + 1));
            $this->line("    ID: {$item->id}");
            $this->line("    Product ID: {$item->product_id}");
            $this->line("    Product Name: " . ($item->product->name ?? 'N/A'));
            $this->line("    Quantity: {$item->quantity}");
            $this->line("    Price: ₹{$item->price}");
            $this->line("    Color: " . ($item->selected_color ?? 'N/A'));
            $this->line("    Blouse: " . ($item->blouse_option ?? 'N/A'));
            $this->newLine();
        }
        
        // Test 4: Simulate API response
        $this->info("Simulating API Response...");
        $items = [];
        foreach ($orderWithItems->orderItems as $oi) {
            $product = $oi->product;
            $items[] = [
                'id' => $oi->id,
                'product_id' => $oi->product_id,
                'product_name' => $product ? $product->name : null,
                'product_image' => $product ? $product->image_url : null,
                'price' => (float)$oi->price,
                'quantity' => (int)$oi->quantity,
                'selected_color' => $oi->selected_color ?? null,
                'blouse_option' => $oi->blouse_option ?? null,
            ];
        }
        
        $this->line(json_encode(['items' => $items, 'items_count' => count($items)], JSON_PRETTY_PRINT));
        $this->newLine();
        
        $this->info("✅ All tests passed! Order items are loading correctly.");
        
        return 0;
    }
}
