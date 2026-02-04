import React from 'react';

type Props = {
  status?: string;
  statusHistory?: { [key: string]: string | null } | null;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  returnReason?: string | null;
};

const STATUS_FLOW = [
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
];

const VerticalStatusTracker: React.FC<Props> = ({ status = '', statusHistory = null, cancelReason, cancelledAt, returnReason }) => {
  const lc = (status || '').toLowerCase();
  const isCancelled = lc === 'cancelled';
  const isReturnRequested = lc === 'return_requested';
  const currentIndex = STATUS_FLOW.indexOf(lc);

  return (
    <div className="order-status-vertical">
      {/** Render normal flow when not cancelled/returned **/}
      {!isCancelled && !isReturnRequested && STATUS_FLOW.map((s, index) => (
        <div key={s} className="status-row">

          <div className="status-left">
            <span className={`dot ${index <= currentIndex ? 'active' : ''}`} />
            {index !== STATUS_FLOW.length - 1 && (
              <span className={`line ${index < currentIndex ? 'active' : ''}`} />
            )}
          </div>

          <div className="status-content">
            <span className={`status-text ${index <= currentIndex ? 'active' : ''}`}>
              {s.replaceAll('_', ' ').toUpperCase()}
            </span>

            {statusHistory?.[s] && (
              <span className="status-time">{statusHistory[s]}</span>
            )}
          </div>

        </div>
      ))}

      {/** Cancelled terminal state **/}
      {isCancelled && (
        <div>
          {STATUS_FLOW.map((s, index) => (
            statusHistory?.[s] ? (
              <div key={s} className="status-row">
                <div className="status-left">
                  <span className={`dot ${statusHistory[s] ? 'active' : ''}`} />
                  {index !== STATUS_FLOW.length - 1 && <span className={`line active`} />}
                </div>
                <div className="status-content">
                  <span className="status-text">{s.replaceAll('_', ' ').toUpperCase()}</span>
                  <span className="status-time">{statusHistory[s]}</span>
                </div>
              </div>
            ) : null
          ))}

          <div className="status-row cancelled">
            <div className="status-left">
              <span className="dot cancelled" />
            </div>
            <div className="status-content">
              <span className="status-text cancelled">CANCELLED</span>
              {cancelledAt && <span className="status-time">{cancelledAt}</span>}
              {cancelReason && <div className="cancel-reason text-sm text-red-600 mt-1">Reason: {cancelReason}</div>}
            </div>
          </div>
        </div>
      )}

      {/** Return Requested state **/}
      {isReturnRequested && (
        <div>
          {STATUS_FLOW.map((s, index) => (
            <div key={s} className="status-row">
              <div className="status-left">
                <span className="dot active" />
                <span className="line active" />
              </div>
              <div className="status-content">
                <span className="status-text active">{s.replaceAll('_', ' ').toUpperCase()}</span>
                {statusHistory?.[s] && <span className="status-time">{statusHistory[s]}</span>}
              </div>
            </div>
          ))}

          <div className="status-row return">
            <div className="status-left">
              <span className="dot active bg-orange-500 border-orange-500" />
            </div>
            <div className="status-content">
              <span className="status-text active text-orange-600 font-bold">RETURN REQUESTED</span>
              {returnReason && <div className="return-reason text-sm text-orange-600 mt-1 font-medium italic">" {returnReason} "</div>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerticalStatusTracker;
