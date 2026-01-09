<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;

class SalesReportController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'nullable|date_format:Y-m-d',
            'to_date' => 'nullable|date_format:Y-m-d|after_or_equal:from_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $fromDate = $request->input('from_date', Carbon::now()->subDays(30)->toDateString());
        $toDate = $request->input('to_date', Carbon::now()->toDateString());

        // Ensure we include the whole day for the 'to' date
        $toDate = Carbon::parse($toDate)->endOfDay();

        $orders = Order::where('payment_status', 'completed')
            ->whereBetween('created_at', [$fromDate, $toDate]);

        $totalSales = $orders->sum('total');
        $totalOrders = $orders->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        $dailySales = $orders->selectRaw('DATE(created_at) as date, SUM(total) as sales')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'sales' => (float) $item->sales,
                ];
            });

        $topSellingProducts = OrderItem::with('product')
            ->whereIn('order_id', $orders->pluck('id'))
            ->selectRaw('product_id, SUM(quantity) as total_quantity_sold, SUM(quantity * price) as total_revenue')
            ->groupBy('product_id')
            ->orderBy('total_quantity_sold', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product ? $item->product->name : 'Unknown Product',
                    'quantity_sold' => (int) $item->total_quantity_sold,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        return response()->json([
            'summary' => [
                'total_sales' => (float) $totalSales,
                'total_orders' => $totalOrders,
                'average_order_value' => (float) $averageOrderValue,
            ],
            'daily_sales' => $dailySales,
            'top_selling_products' => $topSellingProducts,
        ]);
    }
}