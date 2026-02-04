import React from 'react';

interface Props {
  status?: string;
}

const steps = [
  { key: 'PLACED', label: 'Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const StatusTracker: React.FC<Props> = ({ status }) => {
  const currentIndex = Math.max(0, steps.findIndex(s => s.key === status));

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between space-x-4 overflow-x-auto">
        {steps.map((s, idx) => {
          const done = idx <= currentIndex;
          return (
            <div key={s.key} className="flex-1 min-w-[120px] text-center">
              <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {done ? '✓' : idx + 1}
              </div>
              <div className="mt-2 text-sm">{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
