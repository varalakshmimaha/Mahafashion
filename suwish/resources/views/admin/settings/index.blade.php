@extends('admin.layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <div class="page-title-right">
                    <ol class="breadcrumb m-0">
                        <li class="breadcrumb-item"><a href="{{ route('admin.dashboard') }}">Admin</a></li>
                        <li class="breadcrumb-item active">Settings</li>
                    </ol>
                </div>
                <h4 class="page-title">General Settings</h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            {{ session('success') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    <form action="{{ route('admin.settings.update') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <!-- Basic Information Section -->
                        <div class="mb-4">
                            <h5 class="mb-3 text-primary">Basic Information</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="website_name" class="form-label">Website Name *</label>
                                        <input type="text" class="form-control @error('website_name') is-invalid @enderror" 
                                               id="website_name" name="website_name" 
                                               value="{{ old('website_name', $settings['website_name']) }}" required>
                                        @error('website_name')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="website_title" class="form-label">Website Title *</label>
                                        <input type="text" class="form-control @error('website_title') is-invalid @enderror" 
                                               id="website_title" name="website_title" 
                                               value="{{ old('website_title', $settings['website_title']) }}" required>
                                        @error('website_title')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="website_description" class="form-label">Website Description</label>
                                        <textarea class="form-control @error('website_description') is-invalid @enderror" 
                                                  id="website_description" name="website_description" rows="3">{{ old('website_description', $settings['website_description']) }}</textarea>
                                        @error('website_description')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="contact_email" class="form-label">Contact Email *</label>
                                        <input type="email" class="form-control @error('contact_email') is-invalid @enderror" 
                                               id="contact_email" name="contact_email" 
                                               value="{{ old('contact_email', $settings['contact_email']) }}" required>
                                        @error('contact_email')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="contact_phone" class="form-label">Contact Phone</label>
                                        <input type="tel" class="form-control @error('contact_phone') is-invalid @enderror" 
                                               id="contact_phone" name="contact_phone" 
                                               value="{{ old('contact_phone', $settings['contact_phone']) }}">
                                        @error('contact_phone')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="footer_content" class="form-label">Footer Content</label>
                                        <textarea class="form-control @error('footer_content') is-invalid @enderror" 
                                                  id="footer_content" name="footer_content" rows="3">{{ old('footer_content', $settings['footer_content']) }}</textarea>
                                        @error('footer_content')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Branding Section -->
                        <div class="mb-4">
                            <h5 class="mb-3 text-primary">Branding</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="logo" class="form-label">Logo</label>
                                        <input type="file" class="form-control @error('logo') is-invalid @enderror" 
                                               id="logo" name="logo" accept="image/*">
                                        @error('logo')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                        
                                        @if($settings['logo'])
                                            <div class="mt-2">
                                                <p class="mb-1">Current Logo:</p>
                                                <img src="{{ $settings['logo'] }}" alt="Current Logo" class="img-thumbnail" style="max-height: 100px;">
                                            </div>
                                        @endif
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="favicon" class="form-label">Favicon</label>
                                        <input type="file" class="form-control @error('favicon') is-invalid @enderror" 
                                               id="favicon" name="favicon" accept="image/*,.ico">
                                        @error('favicon')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror>
                                        
                                        @if($settings['favicon'])
                                            <div class="mt-2">
                                                <p class="mb-1">Current Favicon:</p>
                                                <img src="{{ $settings['favicon'] }}" alt="Current Favicon" class="img-thumbnail" style="max-height: 50px;">
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Social Media Section -->
                        <div class="mb-4">
                            <h5 class="mb-3 text-primary">Social Media</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="facebook" class="form-label">Facebook URL</label>
                                        <input type="url" class="form-control @error('facebook') is-invalid @enderror" 
                                               id="facebook" name="facebook" 
                                               value="{{ old('facebook', $settings['facebook']) }}" placeholder="https://facebook.com/yourpage">
                                        @error('facebook')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="instagram" class="form-label">Instagram URL</label>
                                        <input type="url" class="form-control @error('instagram') is-invalid @enderror" 
                                               id="instagram" name="instagram" 
                                               value="{{ old('instagram', $settings['instagram']) }}" placeholder="https://instagram.com/yourpage">
                                        @error('instagram')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="twitter" class="form-label">Twitter URL</label>
                                        <input type="url" class="form-control @error('twitter') is-invalid @enderror" 
                                               id="twitter" name="twitter" 
                                               value="{{ old('twitter', $settings['twitter']) }}" placeholder="https://twitter.com/yourpage">
                                        @error('twitter')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label for="whatsapp" class="form-label">WhatsApp Number</label>
                                        <input type="text" class="form-control @error('whatsapp') is-invalid @enderror" 
                                               id="whatsapp" name="whatsapp" 
                                               value="{{ old('whatsapp', $settings['whatsapp']) }}" placeholder="e.g., +1234567890">
                                        @error('whatsapp')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Maintenance Mode Section -->
                        <div class="mb-4">
                            <h5 class="mb-3 text-primary">System Settings</h5>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-check form-switch mb-3">
                                        <input type="checkbox" class="form-check-input" id="maintenance_mode" name="maintenance_mode" 
                                               value="1" {{ $settings['maintenance_mode'] ? 'checked' : '' }}>
                                        <label class="form-check-label" for="maintenance_mode">Enable Maintenance Mode</label>
                                    </div>
                                    <p class="text-muted small mb-0">When enabled, the site will be accessible only to administrators.</p>
                                </div>
                            </div>
                        </div>

                        <div class="text-end">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="fas fa-save me-1"></i> Update Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection