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

                        <!-- Dynamic Social Media Section -->
                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="text-primary m-0">Social Media Links</h5>
                                <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addSocialLinkModal">
                                    <i class="fas fa-plus"></i> Add New Link
                                </button>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-bordered table-centered mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 50px;">Icon</th>
                                            <th>Platform</th>
                                            <th>URL</th>
                                            <th style="width: 100px;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="socialLinksTableBody">
                                        @forelse($socialLinks as $link)
                                            <tr id="link-row-{{ $link->id }}">
                                                <td class="text-center">
                                                    <i class="lucide-{{ $link->icon }} fab fa-{{ $link->icon === 'facebook' ? 'facebook-f' : ($link->icon === 'twitter' ? 'twitter' : ($link->icon === 'instagram' ? 'instagram' : ($link->icon === 'youtube' ? 'youtube' : ($link->icon === 'linkedin' ? 'linkedin-in' : ($link->icon === 'whatsapp' ? 'whatsapp' : 'globe'))))) }}"></i>
                                                </td>
                                                <td>{{ $link->platform }}</td>
                                                <td><a href="{{ $link->url }}" target="_blank" class="text-truncate d-inline-block" style="max-width: 200px;">{{ $link->url }}</a></td>
                                                <td>
                                                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteSocialLink({{ $link->id }})">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        @empty
                                            <tr id="no-links-row">
                                                <td colspan="4" class="text-center text-muted">No social media links found. Add one to get started!</td>
                                            </tr>
                                        @endforelse
                                    </tbody>
                                </table>
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
    <!-- Add Social Link Modal -->
    <div class="modal fade" id="addSocialLinkModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Social Media Link</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addSocialLinkForm">
                        <div class="mb-3">
                            <label class="form-label">Platform Name</label>
                            <input type="text" class="form-control" name="platform" placeholder="e.g. YouTube Channel" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">URL</label>
                            <input type="url" class="form-control" name="url" placeholder="https://..." required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Icon</label>
                            <select class="form-select" name="icon" required>
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="youtube">YouTube</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="globe">Globe (Website)</option>
                                <option value="link">Link (Generic)</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveSocialLink()">Save Link</button>
                </div>
            </div>
        </div>
    </div>

</div>

<script>
    function saveSocialLink() {
        const form = document.getElementById('addSocialLinkForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch("{{ route('admin.social-media-links.store') }}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.link) {
                location.reload(); // Reload to show new link
            } else {
                alert('Failed to add link');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred');
        });
    }

    function deleteSocialLink(id) {
        if (!confirm('Are you sure you want to delete this link?')) return;

        fetch(`/admin/social-media-links/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                alert('Failed to delete link');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred');
        });
    }
</script>
@endsection