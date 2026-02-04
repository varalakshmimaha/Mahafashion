import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Upload, Tag, Layers, CheckCircle } from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Category } from '../../types';
import ProductImageUpload from '../../components/ProductImageUpload';
import VariantBulkGenerator from '../../components/VariantBulkGenerator';

// Steps configuration
const STEPS = [
    { id: 1, title: 'Select Category', icon: Layers },
    { id: 2, title: 'Upload Images', icon: Upload },
    { id: 3, title: 'Product Details', icon: Tag },
    { id: 4, title: 'Add Variants', icon: Layers }, // Using Layers for variants too
];

const AdminCatalogUpload: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Step 1: Category Selection State
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // New states for draft product
    const [draftProductId, setDraftProductId] = useState<number | null>(null);
    const [creatingDraft, setCreatingDraft] = useState(false);

    // Step 3: Product Details State
    const [details, setDetails] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        fabric: '',
        occasion: '',
        drape_length: '',
        care_instructions: '',
        blouse_included: false,
        package_contains: '',
        fit: '',
        origin: ''
    });

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setDetails(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    // Load Categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await categoryAPI.getCategories();
            setCategories(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            addNotification('Failed to load categories', 'error');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // Auto-advance to next step or just mark selected
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (!selectedCategory) {
                addNotification('Please select a category', 'error');
                return;
            }

            // If we don't have a draft product yet, create one
            if (!draftProductId) {
                setCreatingDraft(true);
                try {
                    const formData = new FormData();
                    formData.append('name', `Draft - ${selectedCategory.name} - ${new Date().toLocaleString()}`);
                    formData.append('category_id', selectedCategory.id.toString());
                    formData.append('price', '0'); // Placeholder
                    formData.append('sku', `DRAFT-${Date.now()}`); // Placeholder
                    formData.append('stock_quantity', '0');
                    formData.append('description', 'Draft product description');
                    formData.append('status', 'draft'); // Assuming backend supports 'draft' or 'inactive'

                    const response = await productAPI.createProduct(formData);
                    // Adjust based on response structure (response.data?.id or response.product?.id or response.id)
                    const newId = response.data?.id || response.id || response.product?.id;

                    if (newId) {
                        setDraftProductId(newId);
                        addNotification('Draft product created. You can now upload images.', 'success');
                    } else {
                        throw new Error('Could not get new product ID');
                    }
                } catch (error) {
                    console.error('Error creating draft:', error);
                    addNotification('Failed to initialize product. Please try again.', 'error');
                    setCreatingDraft(false);
                    return;
                } finally {
                    setCreatingDraft(false);
                }
            }
        } else if (currentStep === 3) {
            // Save Details
            if (!details.name || !details.price) {
                addNotification('Please fill in Name and Price', 'error');
                return;
            }

            try {
                const formData = new FormData();
                Object.entries(details).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });
                formData.append('status', 'draft');
                formData.append('blouse_included', details.blouse_included ? '1' : '0');

                if (draftProductId) {
                    await productAPI.updateProduct(draftProductId, formData);
                    addNotification('Details saved', 'success');
                }
            } catch (error) {
                console.error('Error saving details:', error);
                addNotification('Failed to save details', 'error');
                return;
            }
        } else if (currentStep === 4) {
            // Final publish logic (will implement later)
            // Ideally we also save variants here or before this.
            if (draftProductId) {
                try {
                    const formData = new FormData();
                    formData.append('status', 'active');
                    await productAPI.updateProduct(draftProductId, formData);
                    addNotification('Catalog Published Successfully!', 'success');
                    navigate('/admin/products');
                    return;
                } catch (e) {
                    console.error('Error publishing:', e);
                    addNotification('Failed to publish', 'error');
                }
            }
        }

        // Mark current step as complete
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
        }

        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Filter categories based on search
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Catalog</h1>
                <p className="text-gray-500">Follow the steps to upload your product catalog</p>
            </div>

            {/* Stepper */}
            <div className="relative mb-8">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-0"></div>
                <div className="flex justify-between relative z-10">
                    {STEPS.map((step) => {
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = currentStep === step.id;
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center cursor-pointer ${isCompleted || isCurrent ? 'text-primary' : 'text-gray-400'
                                    }`}
                                onClick={() => isCompleted && setCurrentStep(step.id)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors ${isCompleted ? 'border-green-500 text-green-500' :
                                    isCurrent ? 'border-primary text-primary' : 'border-gray-300'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                                </div>
                                <span className={`mt-2 text-sm font-medium ${isCurrent ? 'text-gray-900' : ''}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[400px]">
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Select Category</h2>

                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for a category (e.g. Sarees, Lehengas)..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {loadingCategories ? (
                            <div className="text-center py-12 text-gray-500">Loading categories...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {filteredCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md flex items-center justify-between ${selectedCategory?.id === category.id
                                            ? 'border-primary bg-primary-50 ring-1 ring-primary'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                                {category.image ? (
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded" />
                                                ) : (
                                                    <Layers size={20} />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-700">{category.name}</span>
                                        </div>
                                        {selectedCategory?.id === category.id && (
                                            <CheckCircle size={20} className="text-primary" />
                                        )}
                                    </div>
                                ))}

                                {filteredCategories.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No categories found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Upload Images</h2>
                            <div className="text-sm text-gray-500">
                                ID: {draftProductId}
                            </div>
                        </div>

                        {draftProductId ? (
                            <ProductImageUpload
                                productId={draftProductId}
                                onUploadSuccess={() => { }} // Optional: might want to track if meaningful uploads happened
                            />
                        ) : (
                            <div className="text-red-500">Error: Product context missing. Please go back and try again.</div>
                        )}
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={details.name}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Banarasi Silk Saree with Zari Work"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={details.description}
                                    onChange={handleDetailsChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="Detailed description of the product..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={details.price}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={details.sku}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                                <input
                                    type="text"
                                    name="fabric"
                                    value={details.fabric}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Silk, Cotton"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                                <input
                                    type="text"
                                    name="occasion"
                                    value={details.occasion}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Wedding, Party"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Drape Length (m)</label>
                                <input
                                    type="text"
                                    name="drape_length"
                                    value={details.drape_length}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. 5.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                                <input
                                    type="text"
                                    name="care_instructions"
                                    value={details.care_instructions}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Dry Clean Only"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="blouse_included"
                                        checked={details.blouse_included}
                                        onChange={handleDetailsChange}
                                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                                    />
                                    <span className="ml-2 text-gray-700">Blouse Piece Included</span>
                                </label>
                            </div>

                            {/* New Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Package Contains</label>
                                <input
                                    type="text"
                                    name="package_contains"
                                    value={(details as any).package_contains || ''}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. 1 Saree with Blouse Piece"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fit</label>
                                <input
                                    type="text"
                                    name="fit"
                                    value={(details as any).fit || ''}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Regular"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                <input
                                    type="text"
                                    name="origin"
                                    value={(details as any).origin || ''}
                                    onChange={handleDetailsChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. India"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Generate Variants</h2>
                            <div className="text-sm text-gray-500">
                                ID: {draftProductId}
                            </div>
                        </div>

                        {draftProductId ? (
                            <VariantBulkGenerator
                                productId={draftProductId}
                                onSuccess={() => addNotification('Variants saved. You can now publish.', 'success')}
                            />
                        ) : (
                            <div className="text-red-500">Error: Product context missing. Please go back.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 border border-gray-300 rounded-lg font-medium transition-colors ${currentStep === 1
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Back
                </button>

                <button
                    onClick={handleNext}
                    className="px-8 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    {currentStep === STEPS.length ? 'Publish Catalog' : 'Next'}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default AdminCatalogUpload;
