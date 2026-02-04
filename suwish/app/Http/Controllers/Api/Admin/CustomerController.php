<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('is_admin', false);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->withCount('orders')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($customers);
    }

    /**
     * Display the specified customer with stats and activity.
     */
    public function show(int $id): JsonResponse
    {
        $customer = User::findOrFail($id);

        // Calculate statistics
        $orders = Order::where('user_id', $customer->id)->get();
        
        $totalOrders = $orders->count();
        $completedOrdersList = $orders->where('status', 'delivered');
        $completedOrdersCount = $completedOrdersList->count();
        $pendingOrders = $orders->whereIn('status', ['pending', 'processing', 'shipped'])->count();
        
        $totalSpent = $completedOrdersList->sum('total');
        $averageOrderValue = $completedOrdersCount > 0 ? $totalSpent / $completedOrdersCount : 0;

        // Support Queries (Placeholder as requested, assuming a table might exist or be added later)
        // For now, we return 0 as there is no support query system yet
        $totalQueries = 0;
        $pendingQueries = 0;

        return response()->json([
            'customer' => $customer,
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => round($totalSpent, 2),
                'average_order_value' => round($averageOrderValue, 2),
                'total_queries' => $totalQueries,
                'completed_orders' => $completedOrdersCount,
                'pending_orders' => $pendingOrders,
                'pending_queries' => $pendingQueries,
            ],
            'order_history' => $orders->sortByDesc('created_at')->values(),
        ]);
    }

    /**
     * Toggle customer account status.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $customer = User::findOrFail($id);
        $customer->is_active = !$customer->is_active;
        $customer->save();

        return response()->json([
            'success' => true,
            'is_active' => $customer->is_active,
            'message' => 'Customer status updated successfully.'
        ]);
    }
}
