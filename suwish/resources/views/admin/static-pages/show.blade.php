@extends('admin.layouts.app')

@section('title', 'View Static Page')

@section('content')
<div class="mb-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ $staticPage->title }}</h1>
            <p class="text-gray-600">
                <span class="font-semibold">Slug:</span> {{ $staticPage->slug }} | 
                <span class="font-semibold">Status:</span> 
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $staticPage->status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                    {{ ucfirst($staticPage->status) }}
                </span>
            </p>
        </div>
        <div class="space-x-2">
            <a href="{{ route('admin.static-pages.index') }}" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                &larr; Back
            </a>
            <a href="{{ route('admin.static-pages.edit', $staticPage->name) }}" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                Edit Page
            </a>
        </div>
    </div>
</div>

<div class="bg-white rounded-lg shadow-lg overflow-hidden p-6">
    <div class="prose max-w-none">
        {!! $staticPage->content !!}
    </div>
</div>

<div class="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 class="text-lg font-medium text-gray-900 mb-2">Metadata</h3>
    <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Meta Title</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ $staticPage->meta_title ?? '-' }}</dd>
        </div>
        <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Meta Description</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ $staticPage->meta_description ?? '-' }}</dd>
        </div>
        <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Sort Order</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ $staticPage->sort_order }}</dd>
        </div>
        <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Created At</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ $staticPage->created_at->format('M d, Y H:i A') }}</dd>
        </div>
    </dl>
</div>
@endsection
