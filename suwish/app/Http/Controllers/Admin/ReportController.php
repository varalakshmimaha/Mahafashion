<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDO;

class ReportController extends Controller
{
    public function index()
    {
        // Get sales data for the chart
        $salesData = $this->getSalesData();
        
        // Get top selling products
        $topProducts = $this->getTopSellingProducts();
        
        // Get inventory data
        $inventoryData = $this->getInventoryData();
        
        // Get customer data
        $customerData = $this->getCustomerData();
        
        return view('admin.reports.index', compact(
            'salesData',
            'topProducts',
            'inventoryData',
            'customerData'
        ));
    }
    
    private function getSalesData()
    {
        $connection = DB::connection()->getPDO();
        $driver = $connection->getAttribute(PDO::ATTR_DRIVER_NAME);
        
        if ($driver === 'mysql') {
            // MySQL version
            $sales = \App\Models\Order::select(
                    DB::raw('sum(total) as total_sales'),
                    DB::raw("DATE_FORMAT(created_at, '%b') as month")
                )
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->subMonths(6))
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
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->subMonths(6))
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
    
    private function getTopSellingProducts()
    {
        $products = \App\Models\OrderItem::selectRaw('product_id, sum(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->with('product')
            ->take(5)
            ->get();
        
        $labels = [];
        $data = [];
        
        foreach ($products as $item) {
            $labels[] = $item->product->name ?? 'N/A';
            $data[] = $item->total_quantity;
        }
        
        return [
            'labels' => $labels,
            'data' => $data
        ];
    }
    
    private function getInventoryData()
    {
        // Get inventory value over time (last 6 months)
        $connection = DB::connection()->getPDO();
        $driver = $connection->getAttribute(PDO::ATTR_DRIVER_NAME);
        
        if ($driver === 'mysql') {
            // MySQL version
            $inventory = \App\Models\Product::select(
                    DB::raw('sum(stock_quantity * price) as total_value'),
                    DB::raw("DATE_FORMAT(created_at, '%b') as month")
                )
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('created_at', 'asc')
                ->get();
        } else {
            // SQLite version - use strftime for date formatting
            $inventory = \App\Models\Product::select(
                    DB::raw('sum(stock_quantity * price) as total_value'),
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
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month_num')
                ->orderBy('month_num', 'asc')
                ->get();
        }

        $labels = $inventory->pluck('month');
        $data = $inventory->pluck('total_value');

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }
    
    private function getCustomerData()
    {
        // Get customer statistics
        $totalCustomers = \App\Models\User::count();
        $activeCustomers = \App\Models\User::where('created_at', '>=', now()->subMonths(1))->count();
        $inactiveCustomers = $totalCustomers - $activeCustomers;
        
        // Get customer registration trend
        $connection = DB::connection()->getPDO();
        $driver = $connection->getAttribute(PDO::ATTR_DRIVER_NAME);
        
        if ($driver === 'mysql') {
            // MySQL version
            $monthlyRegistrations = \App\Models\User::select(
                    DB::raw('count(*) as count'),
                    DB::raw("DATE_FORMAT(created_at, '%b') as month")
                )
                ->where('created_at', '>=', now()->subMonths(5))
                ->groupBy('month')
                ->orderBy('created_at', 'asc')
                ->get();
        } else {
            // SQLite version - use strftime for date formatting
            $monthlyRegistrations = \App\Models\User::select(
                    DB::raw('count(*) as count'),
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
                ->where('created_at', '>=', now()->subMonths(5))
                ->groupBy('month_num')
                ->orderBy('month_num', 'asc')
                ->get();
        }
        
        $labels = $monthlyRegistrations->pluck('month');
        $data = $monthlyRegistrations->pluck('count');

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }
}
