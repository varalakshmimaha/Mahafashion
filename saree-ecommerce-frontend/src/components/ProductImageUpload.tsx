import React, { useState, useRef } from 'react';

interface ImageUploadData {
  file: File;
  preview: string;
  colorCode: string | null;
  isDefault: boolean;
}

interface ProductImageUploadProps {
  productId: number;
  existingImages?: Array<{
    id: number;
    image_url: string;
    color_code: string | null;
    is_default: boolean;
  }>;
  onUploadSuccess?: () => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productId,
  existingImages = [],
  onUploadSuccess
}) => {
  const [images, setImages] = useState<ImageUploadData[]>([]);
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null);
  const [isDefaultForColor, setIsDefaultForColor] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      addImages(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(Array.from(e.target.files));
    }
  };

  const addImages = (files: File[]) => {
    const newImages: ImageUploadData[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      colorCode: selectedColorCode,
      isDefault: isDefaultForColor
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const updateImageColor = (index: number, colorCode: string | null) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index].colorCode = colorCode;
      return updated;
    });
  };

  const updateImageDefault = (index: number, isDefault: boolean) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index].isDefault = isDefault;
      // Only one image per color can be default
      if (isDefault) {
        updated.forEach((img, i) => {
          if (i !== index && img.colorCode === updated[index].colorCode) {
            img.isDefault = false;
          }
        });
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);

    try {
      // Group images by color
      const imagesByColor = images.reduce((acc, img) => {
        const key = img.colorCode || 'default';
        if (!acc[key]) acc[key] = [];
        acc[key].push(img);
        return acc;
      }, {} as Record<string, ImageUploadData[]>);

      // Upload each color group
      for (const [colorKey, colorImages] of Object.entries(imagesByColor)) {
        const formData = new FormData();
        
        colorImages.forEach((img, index) => {
          formData.append(`images[${index}]`, img.file);
        });

        if (colorKey !== 'default') {
          formData.append('color_code', colorKey);
        }

        // Set default flag (only first image in group can be default)
        const hasDefault = colorImages.some(img => img.isDefault);
        if (hasDefault) {
          formData.append('is_default', 'true');
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${productId}/images`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
      }

      // Clear uploaded images
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      
      // Show success message but keep the form open for continuous uploads
      alert(`${images.length} image(s) uploaded successfully! You can continue adding more images.`);
      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeletingImageId(imageId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/images/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      alert('Image deleted successfully!');
      onUploadSuccess?.(); // Refresh the images list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700">Color Assignment:</label>
        <input
          type="color"
          value={selectedColorCode || '#000000'}
          onChange={(e) => setSelectedColorCode(e.target.value)}
          className="w-12 h-12 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={selectedColorCode || ''}
          onChange={(e) => setSelectedColorCode(e.target.value || null)}
          placeholder="#RRGGBB or leave empty for default"
          className="px-3 py-2 border rounded flex-1"
          maxLength={7}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDefaultForColor}
            onChange={(e) => setIsDefaultForColor(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Default for this color</span>
        </label>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to upload
            </button>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF, SVG, WEBP up to 2MB
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">
            Selected Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                
                {/* Color indicator */}
                {img.colorCode && (
                  <div
                    className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: img.colorCode }}
                  />
                )}

                {/* Default badge */}
                {img.isDefault && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Default
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Edit controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={img.colorCode || '#000000'}
                      onChange={(e) => updateImageColor(index, e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer"
                      title="Change color"
                    />
                    <label className="flex items-center gap-1 text-white text-xs flex-1">
                      <input
                        type="checkbox"
                        checked={img.isDefault}
                        onChange={(e) => updateImageDefault(index, e.target.checked)}
                        className="w-3 h-3"
                      />
                      Default
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">
            Existing Images ({existingImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={`http://127.0.0.1:8000/${img.image_url}`}
                  alt="Product"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                
                {img.color_code && (
                  <div
                    className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: img.color_code }}
                  />
                )}

                {img.is_default && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Default
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteExistingImage(img.id)}
                  disabled={deletingImageId === img.id}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="Delete image"
                >
                  {deletingImageId === img.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {images.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : `Upload ${images.length} Image${images.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
