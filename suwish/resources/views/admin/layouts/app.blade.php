<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Maha Fashion Admin Panel</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Alpine.js for interactivity -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Chart.js for charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        /* Dynamic Theme Injection */
        @if(isset($theme) || ($theme = \App\Models\Theme::where('is_active', true)->first()))
            :root {
                --primary-color: {{ $theme->primary_color }};
                --secondary-color: {{ $theme->secondary_color }};
                --accent-color: {{ $theme->accent_color ?? '#ec4899' }};
                --success-color: {{ $theme->success_color ?? '#10b981' }};
                --warning-color: {{ $theme->warning_color ?? '#f59e0b' }};
                --danger-color: {{ $theme->danger_color ?? '#ef4444' }};
                
                /* Extended Theme Properties */
                --button-color: {{ $theme->button_color ?: $theme->primary_color }};
                --text-color: {{ $theme->text_color }};
                --bg-color: {{ $theme->background_color }};
                --font-family: {!! $theme->font_family !!};
                --border-radius: {{ $theme->border_radius }};
                
                --dark-color: {{ $theme->text_color }}; /* Override dark with text color */
                --light-color: #f9fafb;
                --sidebar-bg: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            }
            body {
                 font-family: var(--font-family) !important;
            }
            .sidebar {
                border-top-right-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
            }
            .btn, .btn-primary {
                 background: var(--button-color) !important;
                 border-radius: var(--border-radius) !important;
                 border: none !important;
            }
        @else
            /* Fallback to legacy settings */
            :root {
                --primary-color: {{ \App\Models\Setting::get('theme_primary_color', '#6366f1') }}; 
                --secondary-color: {{ \App\Models\Setting::get('theme_secondary_color', '#8b5cf6') }}; 
                --accent-color: {{ \App\Models\Setting::get('theme_accent_color', '#ec4899') }}; 
                --success-color: {{ \App\Models\Setting::get('theme_success_color', '#10b981') }}; 
                --warning-color: {{ \App\Models\Setting::get('theme_warning_color', '#f59e0b') }}; 
                --danger-color: {{ \App\Models\Setting::get('theme_danger_color', '#ef4444') }}; 
                --dark-color: #1f2937;
                --light-color: #f9fafb;
                --sidebar-bg: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            }
        @endif
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: var(--dark-color);
        }
        
        .sidebar {
            background: var(--sidebar-bg);
            backdrop-filter: blur(10px);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar a {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .sidebar a::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            transition: width 0.3s ease;
        }
        
        .sidebar a:hover::before {
            width: 100%;
        }
        
        .sidebar a:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: translateX(5px);
        }
        
        .sidebar .active {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
            border-left: 4px solid var(--accent-color);
            box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
        }
        
        .admin-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border-bottom: 1px solid rgba(229, 231, 235, 0.5);
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(229, 231, 235, 0.5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: left 0.5s ease;
        }
        
        .stat-card:hover::before {
            left: 100%;
        }
        
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        
        .form-control {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
        }
        
        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            outline: none;
        }
        
        .notification-badge {
            background: linear-gradient(135deg, var(--danger-color), var(--accent-color));
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .user-avatar {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                z-index: 50;
            }
            
            .sidebar.open {
                transform: translateX(0);
            }
            
            .flex-1.flex.flex-col.overflow-hidden {
                margin-left: 0 !important;
            }
            
            .admin-header {
                padding: 12px 16px;
            }
            
            .admin-header h2 {
                font-size: 1.1rem;
            }
            
            .user-avatar {
                width: 8px;
                height: 8px;
            }
            
            .user-avatar span {
                display: none;
            }
            
            .grid.grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .grid.grid-cols-1.lg\:grid-cols-2 {
                grid-template-columns: 1fr;
            }
            
            .stat-card {
                padding: 16px;
            }
            
            .stat-card .text-3xl {
                font-size: 1.5rem;
            }
            
            .chart-container {
                height: 300px !important;
            }
            
            main {
                padding: 16px;
            }
            
            .btn {
                padding: 10px 16px;
                font-size: 0.875rem;
            }
            
            .table {
                font-size: 0.875rem;
            }
            
            .table thead th {
                padding: 12px 8px;
            }
            
            .table tbody td {
                padding: 12px 8px;
            }
        }
        
        @media (max-width: 480px) {
            .admin-header .flex.items-center.space-x-4 {
                gap: 8px;
            }
            
            .notification-badge {
                width: 4px;
                height: 4px;
                font-size: 0.625rem;
            }
            
            .stat-card .flex.items-center.justify-between {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            
            .stat-card .text-blue-500.opacity-20,
            .stat-card .text-emerald-500.opacity-20,
            .stat-card .text-amber-500.opacity-20,
            .stat-card .text-purple-500.opacity-20 {
                display: none;
            }
        }
    </style>
</head>
<body class="bg-gray-100">
    <div x-data="{ sidebarOpen: true }" class="flex h-screen">
        <!-- Sidebar -->
        <div x-show="sidebarOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="-translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="translate-x-0" x-transition:leave-end="-translate-x-full" class="sidebar text-white w-64 fixed h-full z-10 overflow-y-auto">
            <div class="p-6 border-b border-white/20">
                <h1 class="text-2xl font-bold flex items-center">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mr-3">
                        <i class="fas fa-crown text-white"></i>
                    </div>
                    <span class="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Maha Fashion Admin</span>
                </h1>
            </div>
            
            <nav class="mt-6">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                    <i class="fas fa-tachometer-alt mr-3"></i>
                    Dashboard
                </a>
                
                <a href="{{ route('admin.products.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.products.*') ? 'active' : '' }}">
                    <i class="fas fa-box mr-3"></i>
                    Products
                </a>
                
                <a href="{{ route('admin.categories.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.categories.*') ? 'active' : '' }}">
                    <i class="fas fa-tags mr-3"></i>
                    Categories
                </a>
                
                <a href="{{ route('admin.orders.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}">
                    <i class="fas fa-shopping-cart mr-3"></i>
                    Orders
                </a>
                
                <a href="{{ route('admin.users.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.users.*') ? 'active' : '' }}">
                    <i class="fas fa-users mr-3"></i>
                    Users
                </a>
                
                <a href="{{ route('admin.banners.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.banners.*') ? 'active' : '' }}">
                    <i class="fas fa-image mr-3"></i>
                    Banners
                </a>
                
                <a href="{{ route('admin.static-pages.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.static-pages.*') ? 'active' : '' }}">
                    <i class="fas fa-file-alt mr-3"></i>
                    Static Pages
                </a>
                
                <a href="{{ route('admin.promotions.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.promotions.*') ? 'active' : '' }}">
                    <i class="fas fa-percentage mr-3"></i>
                    Promotions
                </a>
                
                <a href="{{ route('admin.offers.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.offers.*') ? 'active' : '' }}">
                    <i class="fas fa-gift mr-3"></i>
                    Offers
                </a>
                
                <a href="{{ route('admin.payment-gateways.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.payment-gateways.*') ? 'active' : '' }}">
                    <i class="fas fa-credit-card mr-3"></i>
                    Payment Gateways
                </a>
                
                <a href="{{ route('admin.reports.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.reports.*') ? 'active' : '' }}">
                    <i class="fas fa-chart-bar mr-3"></i>
                    Reports
                </a>
                
                <a href="{{ route('admin.settings.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.settings.index') ? 'active' : '' }}">
                    <i class="fas fa-cog mr-3"></i>
                    Settings
                </a>
                
                <a href="{{ route('admin.themes.index') }}" class="flex items-center px-6 py-3 text-white {{ request()->routeIs('admin.themes.*') ? 'active' : '' }}">
                    <i class="fas fa-palette mr-3"></i>
                    Theme Console
                </a>
                
                <a href="{{ route('admin.logout') }}" class="flex items-center px-6 py-3 text-white mt-4 border-t border-gray-700">
                    <i class="fas fa-sign-out-alt mr-3"></i>
                    Logout
                </a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden" :class="{'ml-64': sidebarOpen}">
            <!-- Header -->
            <header class="admin-header flex items-center justify-between p-4">
                <div class="flex items-center">
                    <button @click="sidebarOpen = !sidebarOpen" class="text-gray-600 mr-4">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                    <h2 class="text-xl font-semibold text-gray-800">{{ $title ?? 'Dashboard' }}</h2>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <i class="fas fa-bell text-gray-600 cursor-pointer hover:text-primary-color transition-colors"></i>
                        <span class="notification-badge absolute top-0 right-0 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">3</span>
                    </div>
                    
                    <div class="flex items-center">
                        <div class="user-avatar w-10 h-10 rounded-full flex items-center justify-center text-white">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="ml-3">
                            <span class="text-gray-700 font-medium">{{ auth('admin')->user()->name ?? 'Admin' }}</span>
                            <div class="text-xs text-gray-500">Administrator</div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <main class="flex-1 overflow-y-auto p-6">
                <div class="max-w-7xl mx-auto">
                    @yield('content')
                </div>
            </main>
        </div>
    </div>
    
    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>