import React, { useState } from 'react';
import { API_STORAGE_URL } from '../../services/api';
import { AlertCircle, Package, Star, X } from 'lucide-react';
import ReviewForm from '../product/ReviewForm';

interface Props {
  items: any; // defensive: API may return array or object
  status?: string;
}

const ItemsList: React.FC<Props> = ({ items, status }) => {
  const [reviewingProductId, setReviewingProductId] = useState<string | null>(null);
  const safeItems: any[] = Array.isArray(items) ? items : (items ? Object.values(items) : []);

  // ✅ Handle missing items gracefully
  if (!items || safeItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Order Items</h3>
        </div>
        <div className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium mb-1">Unable to load order items</p>
          <p className="text-sm text-gray-500">Please contact support for assistance with this order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b flex items-center gap-2">
        <Package size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Order Items ({safeItems.length})</h3>
      </div>

      <div className="divide-y relative">
        {safeItems.map((item) => {
          const id = item?.id ?? item?.product_id ?? Math.random();
          const pId = (item?.product_id || item?.id)?.toString();
          const imageSrc = item?.product_image || (item?.image ? `${API_STORAGE_URL}/${item.image}` : '/placeholder.png');
          const name = item?.product_name || item?.name || 'Product';
          const qty = item?.quantity ?? item?.qty ?? 0;
          const price = Number(item?.price ?? 0);
          const color = item?.selected_color || item?.color;
          const blouse = item?.blouse_option;

          return (
            <div key={id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                <img
                  src={imageSrc}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-lg border flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{name}</h4>

                  {/* Variant details */}
                  <div className="mt-1 space-y-0.5">
                    {color && (
                      <div className="text-sm text-gray-600">
                        <span className="text-gray-500">Color:</span> {color}
                      </div>
                    )}
                    {blouse && (
                      <div className="text-sm text-gray-600">
                        <span className="text-gray-500">Blouse:</span> {blouse}
                      </div>
                    )}
                    {item?.variant && (
                      <div className="text-sm text-gray-600">{item.variant}</div>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-700">
                    Quantity: <span className="font-medium">{qty}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Subtotal: ₹{(price * qty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Write Review Button - Only if order is delivered */}
                  {(status?.toLowerCase() === 'delivered' || status?.toLowerCase() === 'completed') && (
                    <button
                      onClick={() => setReviewingProductId(pId)}
                      className="flex items-center gap-1 text-sm font-medium text-maroon-600 hover:text-maroon-700 border border-maroon-600 rounded-full px-4 py-1.5 hover:bg-maroon-50 transition-all shadow-sm"
                    >
                      <Star size={14} className="fill-maroon-600" />
                      Rate & Review
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Review Form */}
              {reviewingProductId === pId && (
                <div className="mt-6 border-t pt-6 bg-gray-50/50 p-4 rounded-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 font-playfair">Customer Reviews</h3>
                    <p className="text-sm text-gray-500 mt-1">Based on 0 reviews</p>
                  </div>
                  <ReviewForm
                    productId={pId}
                    onSuccess={() => {
                      setReviewingProductId(null);
                      alert('Review submitted! Thank you.');
                    }}
                    onCancel={() => setReviewingProductId(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsList;
