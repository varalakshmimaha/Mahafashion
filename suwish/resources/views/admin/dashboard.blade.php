@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="mb-8">
    <div class="flex items-center justify-between mb-2">
        <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p class="text-gray-600 mt-1">Welcome back, <span class="font-semibold text-indigo-600">{{ auth('admin')->user()->name ?? 'Admin' }}</span>! </p>
        </div>
        <div class="flex items-center space-x-2">
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <i class="fas fa-circle text-green-500 text-xs mr-1"></i>
                System Online
            </span>
        </div>
    </div>
</div>

<!-- Stats Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="stat-card group">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-box text-xl"></i>
                    </div>
                    <h3 class="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
                    <p class="text-3xl font-bold text-gray-900">{{ number_format($totalProducts) }}</p>
                    <div class="flex items-center mt-2 text-sm">
                        <i class="fas fa-arrow-up text-green-500 mr-1"></i>
                        <span class="text-green-600 font-medium">12% from last month</span>
                    </div>
                </div>
                <div class="text-blue-500 opacity-20">
                    <i class="fas fa-box text-6xl"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="stat-card group">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-shopping-cart text-xl"></i>
                    </div>
                    <h3 class="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
                    <p class="text-3xl font-bold text-gray-900">{{ number_format($totalOrders) }}</p>
                    <div class="flex items-center mt-2 text-sm">
                        <i class="fas fa-arrow-up text-green-500 mr-1"></i>
                        <span class="text-green-600 font-medium">8% from last month</span>
                    </div>
                </div>
                <div class="text-emerald-500 opacity-20">
                    <i class="fas fa-shopping-cart text-6xl"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="stat-card group">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-users text-xl"></i>
                    </div>
                    <h3 class="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
                    <p class="text-3xl font-bold text-gray-900">{{ number_format($totalUsers) }}</p>
                    <div class="flex items-center mt-2 text-sm">
                        <i class="fas fa-arrow-up text-green-500 mr-1"></i>
                        <span class="text-green-600 font-medium">23% from last month</span>
                    </div>
                </div>
                <div class="text-amber-500 opacity-20">
                    <i class="fas fa-users text-6xl"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="stat-card group">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-tag text-xl"></i>
                    </div>
                    <h3 class="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                    <p class="text-3xl font-bold text-gray-900">₹{{ number_format($totalRevenue) }}</p>
                    <div class="flex items-center mt-2 text-sm">
                        <i class="fas fa-arrow-up text-green-500 mr-1"></i>
                        <span class="text-green-600 font-medium">15% from last month</span>
                    </div>
                </div>
                <div class="text-purple-500 opacity-20">
                    <i class="fas fa-tag text-6xl"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Sales Chart -->
<div class="stat-card p-6 mb-8">
    <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-800">Sales Overview</h3>
        <div class="flex items-center space-x-2">
            <button class="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">Week</button>
            <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Month</button>
            <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Year</button>
        </div>
    </div>
    <div class="chart-container" style="position: relative; height:40vh; width:100%;">
        <canvas id="salesChart"></canvas>
    </div>
</div>

<!-- Top Selling Products and Stock Alerts -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Top Selling Products -->
    <div class="stat-card p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">Top Selling Products</h3>
            <i class="fas fa-trophy text-yellow-500 text-xl"></i>
        </div>
        <div class="space-y-4">
            @if(count($topSellingProducts) > 0)
                @foreach($topSellingProducts as $index => $item)
                <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold mr-3">
                            {{ $index + 1 }}
                        </div>
                        <div>
                            <span class="font-semibold text-gray-800">{{ $item->product->name ?? 'N/A' }}</span>
                            <div class="text-sm text-gray-500">{{ $item->product->category->name ?? 'Uncategorized' }}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-indigo-600">{{ $item->total_quantity }}</span>
                        <div class="text-sm text-gray-500">sold</div>
                    </div>
                </div>
                @endforeach
            @else
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-box-open text-4xl mb-3 text-gray-300"></i>
                    <div>No top selling products data available</div>
                </div>
            @endif
        </div>
    </div>
    
    <!-- Stock Alerts -->
    <div class="stat-card p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">Stock Alerts</h3>
            <i class="fas fa-exclamation-triangle text-orange-500 text-xl"></i>
        </div>
        <div class="space-y-4">
            @if(count($stockAlerts) > 0)
                @foreach($stockAlerts as $product)
                <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full {{ $product->stock_quantity <= 5 ? 'bg-red-100' : ($product->stock_quantity <= 10 ? 'bg-yellow-100' : 'bg-green-100') }} {{ $product->stock_quantity <= 5 ? 'text-red-600' : ($product->stock_quantity <= 10 ? 'text-yellow-600' : 'text-green-600') }} flex items-center justify-center mr-3">
                            <i class="fas fa-box text-sm"></i>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-800">{{ $product->name }}</span>
                            <div class="text-sm text-gray-500">{{ $product->category->name ?? 'Uncategorized' }}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-bold {{ $product->stock_quantity <= 5 ? 'text-red-600' : ($product->stock_quantity <= 10 ? 'text-yellow-600' : 'text-green-600') }}">{{ $product->stock_quantity }}</span>
                        <div class="text-sm text-gray-500">left</div>
                    </div>
                </div>
                @endforeach
            @else
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-check-circle text-4xl mb-3 text-green-300"></i>
                    <div>All stock levels are healthy</div>
                </div>
            @endif
        </div>
    </div>
</div>

    <!-- Hidden data for JavaScript -->
    <div id="salesData" style="display: none;">{!! json_encode($salesData ?? ['labels' => [], 'data' => []]) !!}</div>
    
    <script>
// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    // Sales Chart with dynamic data
    const salesDataElement = document.getElementById('salesData');
    const salesData = salesDataElement ? JSON.parse(salesDataElement.textContent || '{}') : {labels: [], data: []};
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Sales Amount (₹)',
                data: salesData.data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4f46e5'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
});
</script>
@endsection