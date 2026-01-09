@extends('admin.layouts.app')

@section('title', 'Reports')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
    <p class="text-gray-600">View detailed reports and analytics for your store</p>
</div>

<!-- Report Filters -->
<div class="bg-white p-6 rounded-lg shadow mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Sales Report</option>
                <option>Inventory Report</option>
                <option>Customer Report</option>
                <option>Top Selling Products</option>
            </select>
        </div>
        <div class="flex items-end">
            <button class="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md">
                Generate Report
            </button>
        </div>
    </div>
</div>

<!-- Reports Section -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <!-- Sales Report -->
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Sales Report</h3>
        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
            <canvas id="salesReportChart"></canvas>
        </div>
    </div>
    
    <!-- Top Selling Products -->
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
            <canvas id="topProductsChart"></canvas>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Inventory Report -->
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Inventory Report</h3>
        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
            <canvas id="inventoryChart"></canvas>
        </div>
    </div>
    
    <!-- Customer Report -->
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Customer Report</h3>
        <div class="chart-container" style="position: relative; height:40vh; width:100%;">
            <canvas id="customerChart"></canvas>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Function to create chart with error handling
    function createChart(canvasId, chartType, chartData, chartOptions) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (!ctx) {
            console.error('Canvas element not found for ID:', canvasId);
            return null;
        }
        
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            ...chartOptions
        };
        
        try {
            return new Chart(ctx, {
                type: chartType,
                data: chartData,
                options: options
            });
        } catch (error) {
            console.error('Error creating chart for', canvasId, ':', error);
            return null;
        }
    }
    
    // Sales Report Chart
    const salesChart = createChart('salesReportChart', 'bar', {
        labels: <?php echo json_encode($salesData['labels']); ?>,
        datasets: [{
            label: 'Sales Amount (₹)',
            data: <?php echo json_encode($salesData['data']); ?>,
            backgroundColor: 'rgba(251, 191, 36, 0.7)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 1
        }]
    }, {
        plugins: {
            legend: {
                display: false
            }
        }
    });
    
    // Top Products Chart
    const topProductsChart = createChart('topProductsChart', 'doughnut', {
        labels: <?php echo json_encode($topProducts['labels']); ?>,
        datasets: [{
            label: 'Sales Count',
            data: <?php echo json_encode($topProducts['data']); ?>,
            backgroundColor: [
                'rgba(79, 70, 229, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(239, 68, 68, 0.7)'
            ]
        }]
    }, {
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    });
    
    // Inventory Chart
    const inventoryChart = createChart('inventoryChart', 'line', {
        labels: <?php echo json_encode($inventoryData['labels']); ?>,
        datasets: [{
            label: 'Inventory Value (₹)',
            data: <?php echo json_encode($inventoryData['data']); ?>,
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
        }]
    }, {
        plugins: {
            legend: {
                display: false
            }
        }
    });
    
    // Customer Chart
    const customerChart = createChart('customerChart', 'radar', {
        labels: <?php echo json_encode($customerData['labels']); ?>,
        datasets: [{
            label: 'Customer Distribution',
            data: <?php echo json_encode($customerData['data']); ?>,
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: 'rgba(245, 158, 11, 1)',
            pointBackgroundColor: 'rgba(245, 158, 11, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(245, 158, 11, 1)'
        }]
    }, {
        plugins: {
            legend: {
                display: false
            }
        }
    });
});
</script>
@endsection