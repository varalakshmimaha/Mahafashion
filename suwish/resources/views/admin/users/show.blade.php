@extends('admin.layouts.app')

@section('title', 'View User')

@section('content')
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">User Details</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
        <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Name: {{ $user->name }}</h2>
        </div>
        <div class="mb-4">
            <p class="text-gray-600"><strong>Email:</strong> {{ $user->email }}</p>
        </div>
        <div class="mb-4">
            <p class="text-gray-600"><strong>Created At:</strong> {{ $user->created_at->format('M d, Y H:i A') }}</p>
        </div>
        <div class="mb-4">
            <p class="text-gray-600"><strong>Active:</strong> {{ $user->is_active ? 'Yes' : 'No' }}</p>
        </div>

        <hr class="my-6 border-gray-200">

        <h3 class="text-lg font-bold mb-4 text-gray-800">Contact & Address Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                 <p class="text-gray-600 mb-2"><strong>Phone:</strong> {{ $user->phone ?? 'N/A' }}</p>
                 <p class="text-gray-600 mb-2"><strong>Date of Birth:</strong> {{ $user->date_of_birth ?? 'N/A' }}</p>
            </div>
            <div>
                <p class="text-gray-600 mb-2 font-semibold">Shipping Address:</p>
                @if($user->shipping_address || $user->shipping_city)
                    <address class="text-gray-600 not-italic">
                        {{ $user->shipping_name ?? $user->name }}<br>
                        {{ $user->shipping_address }}<br>
                        {{ $user->shipping_city }}, {{ $user->shipping_state }} {{ $user->shipping_pincode }}<br>
                        <strong>Phone:</strong> {{ $user->shipping_phone ?? $user->phone }}
                    </address>
                @else
                    <p class="text-gray-500 italic">No shipping address provided.</p>
                @endif
            </div>
        </div>
        <div class="mt-6">
            <a href="{{ route('admin.users.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Back to Users
            </a>
        </div>
    </div>
</div>
@endsection
