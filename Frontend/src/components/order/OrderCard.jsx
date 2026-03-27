import { Link } from 'react-router-dom';
import { HiArrowRight, HiPhotograph } from 'react-icons/hi';
import Badge from '../common/Badge';
import { formatPrice } from '../../utils/currency';

const statusVariants = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  returned: 'error',
};

export default function OrderCard({ order, isCustom = false }) {
  const detailUrl = isCustom
    ? `/custom-orders/${order._id}`
    : `/orders/${order._id}`;
  const status = isCustom ? order.status : order.orderStatus;

  return (
    <div
      className="
        group
        bg-paper rounded-2xl
        border border-cream
        overflow-hidden
        hover-lift
        transition-all duration-500
        hover:border-mist/40
      "
    >
      {/* ---- Header ---- */}
      <div
        className="
          flex flex-col sm:flex-row sm:items-center justify-between gap-3
          px-5 py-4
          bg-cream/30 border-b border-cream
        "
      >
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink truncate">
            {order.orderNumber}
          </p>
          <p className="text-xs text-mist mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant={statusVariants[status]}>{status}</Badge>
      </div>

      {/* ---- Body ---- */}
      <div className="px-5 py-4">
        {/* Regular Order Items */}
        {!isCustom && order.items && (
          <div className="space-y-3">
            {order.items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <div
                  className="
                    w-14 h-14 rounded-xl overflow-hidden
                    bg-cream shrink-0
                  "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-mist mt-0.5">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-mist font-medium pl-[68px]">
                +{order.items.length - 3} more item
                {order.items.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Custom Order Preview */}
        {isCustom && (
          <div className="flex items-center gap-4">
            <div
              className="
                w-20 h-20 rounded-xl overflow-hidden
                bg-cream shrink-0
              "
            >
              {order.referenceImage?.url ? (
                <img
                  src={order.referenceImage.url}
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HiPhotograph className="w-6 h-6 text-mist" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <p className="text-xs text-mist">
                  Style:{' '}
                  <span className="font-semibold text-charcoal">
                    {order.sketchStyle}
                  </span>
                </p>
                <p className="text-xs text-mist">
                  Size:{' '}
                  <span className="font-semibold text-charcoal">
                    {order.canvasSize}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---- Footer ---- */}
      <div
        className="
          flex items-center justify-between
          px-5 py-3.5
          border-t border-cream
        "
      >
        <p>Total: <strong>{formatPrice(order.totalAmount)}</strong></p>
        <Link
          to={detailUrl}
          className="
            group/link
            inline-flex items-center gap-1.5
            text-xs font-semibold text-rust
            hover:text-gold
            transition-colors duration-300 cursor-pointer
          "
        >
          View Details
          <HiArrowRight
            className="
              w-3.5 h-3.5
              group-hover/link:translate-x-1
              transition-transform duration-300
            "
          />
        </Link>
      </div>
    </div>
  );
}