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
        <div class="mt-6">
            <a href="{{ route('admin.users.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Back to Users
            </a>
        </div>
    </div>
</div>
@endsection
