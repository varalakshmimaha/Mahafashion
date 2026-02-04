import React from 'react';
import { FileText, X } from 'lucide-react';

interface Props {
  status?: string;
  paymentMethod?: string;
  invoiceUrl?: string | null;
  onCancel?: () => void;
  onReturn?: () => void;
  onTrack?: () => void;
  onDownloadInvoice?: () => void;
}

const STATUS_CAN_CANCEL = ['placed', 'confirmed'];

const ActionButtons: React.FC<Props> = ({ status, paymentMethod, invoiceUrl, onCancel, onReturn, onTrack, onDownloadInvoice }) => {
  const lc = (status || '').toLowerCase();
  const payment = (paymentMethod || '').toLowerCase();
  const showCancel = STATUS_CAN_CANCEL.includes(lc);
  const showReturn = lc === 'delivered';
  const showTrack = ['shipped', 'out_for_delivery'].includes(lc);

  // ✅ COD Invoice Rules
  const isCOD = payment === 'cod';
  const isDelivered = lc === 'delivered';

  // Invoice available only if:
  // - For COD: order is delivered
  // - For Online: order is shipped or delivered
  const invoiceAvailable = (isCOD ? isDelivered : ['shipped', 'delivered'].includes(lc));

  // Helper text for disabled invoice
  const invoiceHelperText = isCOD && !isDelivered
    ? 'Invoice will be available after delivery'
    : 'Invoice not yet available';

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Actions</h3>
      </div>

      <div className="p-4 space-y-3">
        {/* Invoice Button */}
        {invoiceAvailable ? (
          <button
            onClick={onDownloadInvoice}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-maroon-600 text-white font-medium rounded-lg hover:bg-maroon-700 transition-colors"
          >
            <FileText size={18} />
            Download Invoice
          </button>
        ) : (
          <div className="space-y-1">
            <button
              className="w-full px-4 py-3 bg-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
              disabled
            >
              <X size={18} />
              Invoice Unavailable
            </button>
            <p className="text-xs text-gray-500 text-center">{invoiceHelperText}</p>
          </div>
        )}

        {/* Action Buttons */}
        {showCancel && (
          <button
            onClick={onCancel}
            className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
        )}

        {showTrack && (
          <button
            onClick={onTrack}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Track Order
          </button>
        )}

        {showReturn && (
          <button
            onClick={onReturn}
            className="w-full px-4 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Return / Replace
          </button>
        )}

        {/* Support Links */}
        <div className="pt-3 border-t space-y-2">
          <a
            href="tel:+911234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            📞 Call Support
          </a>
          <a
            href="mailto:support@domain.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            ✉️ Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
