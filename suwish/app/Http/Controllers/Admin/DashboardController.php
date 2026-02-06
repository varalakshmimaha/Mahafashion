<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use PDO;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch dynamic data for the dashboard
        $totalProducts = \App\Models\Product::count();
        $totalOrders = \App\Models\Order::count();
        $totalUsers = \App\Models\User::count();
        
        // Calculate revenue - sum of all paid orders (regardless of fulfillment status)
        $totalRevenue = \App\Models\Order::where('payment_status', 'paid')
            ->sum('total');
        
        // Get recent orders
        $recentOrders = \App\Models\Order::with('user')
            ->latest()
            ->take(5)
            ->get();
        
        // Get top selling products
        $topSellingProducts = \App\Models\OrderItem::selectRaw('product_id, sum(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->with('product')
            ->take(5)
            ->get();
        
        // Get stock alerts
        $stockAlerts = \App\Models\Product::where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->take(5)
            ->get();

        // Get sales data for chart
        $salesData = $this->getSalesDataForChart();
        
        return view('admin.dashboard', compact(
            'totalProducts', 
            'totalOrders', 
            'totalUsers', 
            'totalRevenue',
            'recentOrders',
            'topSellingProducts',
            'stockAlerts',
            'salesData'
        ));
    }

    private function getSalesDataForChart()
    {
        $connection = DB::connection()->getPDO();
        $driver = $connection->getAttribute(PDO::ATTR_DRIVER_NAME);
        
        if ($driver === 'mysql') {
            // MySQL version
            $sales = \App\Models\Order::select(
                    DB::raw('sum(total) as total_sales'),
                    DB::raw("DATE_FORMAT(created_at, '%b') as month")
                )
                ->where('payment_status', 'paid')
                ->where('created_at', '>=', Carbon::now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('created_at', 'asc')
                ->get();
        } else {
            // SQLite version - use strftime for date formatting
            $sales = \App\Models\Order::select(
                    DB::raw('sum(total) as total_sales'),
                    DB::raw("strftime('%m', created_at) as month_num"),
                    DB::raw("CASE strftime('%m', created_at)
                        WHEN '01' THEN 'Jan'
                        WHEN '02' THEN 'Feb'
                        WHEN '03' THEN 'Mar'
                        WHEN '04' THEN 'Apr'
                        WHEN '05' THEN 'May'
                        WHEN '06' THEN 'Jun'
                        WHEN '07' THEN 'Jul'
                        WHEN '08' THEN 'Aug'
                        WHEN '09' THEN 'Sep'
                        WHEN '10' THEN 'Oct'
                        WHEN '11' THEN 'Nov'
                        WHEN '12' THEN 'Dec'
                        ELSE 'Unknown'
                    END as month")
                )
                ->where('payment_status', 'paid')
                ->where('created_at', '>=', Carbon::now()->subMonths(6))
                ->groupBy('month_num')
                ->orderBy('month_num', 'asc')
                ->get();
        }

        $labels = $sales->pluck('month');
        $data = $sales->pluck('total_sales');

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }

    public function reports()
    {
        return redirect()->route('reports.index');
    }

    public function settings()
    {
        return view('admin.settings.index');
    }
}