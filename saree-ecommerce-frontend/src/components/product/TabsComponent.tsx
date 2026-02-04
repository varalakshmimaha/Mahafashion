import React, { useState, forwardRef } from 'react';
import { SareeProduct } from '../../types';
import { Package, CheckCircle, Truck, RotateCcw, Shield } from 'lucide-react';
import ReviewList from './ReviewList';

interface TabsComponentProps {
    product: SareeProduct;
}

const TabsComponent = forwardRef<HTMLDivElement, TabsComponentProps>(({ product }, ref) => {
    const [activeTab, setActiveTab] = useState('description');

    const totalReviews = product.review_count || 0;

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'details', label: 'Product Details' },
        { id: 'reviews', label: `Customer Reviews (${totalReviews})` },
    ];

    return (
        <div className="mt-8 product-tabs" ref={ref}>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id
                                ? 'border-maroon-600 text-maroon-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {/* Description Tab */}
                {activeTab === 'description' && (
                    <div className="prose max-w-none text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                    </div>
                )}

                {/* Product Details Tab (AJIO Style) */}
                {activeTab === 'details' && (
                    <div className="space-y-4 text-sm sm:text-base">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Package contains</span>
                            <span className="text-gray-900 font-medium">1 Saree with Unstitched Blouse Piece</span>
                        </div>
                        {product.fabric && (
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Fabric</span>
                                <span className="text-gray-900 font-medium">{product.fabric}</span>
                            </div>
                        )}
                        {/* Assuming pattern exists on product or we can fallback */}
                        {(product as any).pattern && (
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Pattern</span>
                                <span className="text-gray-900 font-medium">{(product as any).pattern.name || (product as any).pattern.toString()}</span>
                            </div>
                        )}
                        {product.workType && (
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Work Type</span>
                                <span className="text-gray-900 font-medium">{product.workType}</span>
                            </div>
                        )}
                        {product.occasion && (
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Occasion</span>
                                <span className="text-gray-900 font-medium">{product.occasion}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Fit</span>
                            <span className="text-gray-900 font-medium">Regular</span>
                        </div>
                        {product.careInstructions && (
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500">Care Instructions</span>
                                <span className="text-gray-900 font-medium">{product.careInstructions}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Origin</span>
                            <span className="text-gray-900 font-medium">India</span>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <ReviewList productId={product.id.toString()} />
                )}

                {/* Shipping Tab (hidden but accessible via old ID for backwards compatibility) */}
                {activeTab === 'shipping' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Truck size={24} className="text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                            <p className="text-gray-600 text-sm">Free shipping on all orders above ₹999. Standard delivery in 5-7 business days.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <RotateCcw size={24} className="text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
                            <p className="text-gray-600 text-sm">7-day hassle-free returns on unworn items with original tags and packaging.</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield size={24} className="text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                            <p className="text-gray-600 text-sm">100% secure payments. Cash on Delivery available across India.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

TabsComponent.displayName = 'TabsComponent';

export default TabsComponent;