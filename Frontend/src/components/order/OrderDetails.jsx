import { HiExternalLink, HiPhotograph } from 'react-icons/hi';
import Badge from '../common/Badge';
import OrderTimeline from './OrderTimeline';

const statusVariants = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  returned: 'error',
  paid: 'success',
  unpaid: 'warning',
};

export default function OrderDetails({ order, isCustom = false }) {
  const status = isCustom ? order.status : order.orderStatus;

  const SectionCard = ({ title, children, className = '' }) => (
    <div
      className={`
        bg-paper rounded-2xl
        border border-cream
        overflow-hidden
        ${className}
      `}
    >
      {title && (
        <div className="px-5 py-3.5 border-b border-cream bg-cream/30">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="px-5 py-5">{children}</div>
    </div>
  );

  return (
    <div
      className="space-y-5 lg:space-y-6 animate-fade-in-up"
      style={{ animationFillMode: 'forwards' }}
    >
      {/* ---- Header ---- */}
      <div
        className="
          flex flex-col sm:flex-row sm:items-center justify-between gap-3
          pb-5 border-b border-cream
        "
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
            Order {order.orderNumber}
          </h2>
          <p className="text-xs text-mist mt-1">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[status]}>{status}</Badge>
          <Badge variant={statusVariants[order.paymentStatus]}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* ---- Regular Items ---- */}
      {!isCustom && order.items && (
        <SectionCard title="Items">
          <div className="divide-y divide-cream">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="
                  flex items-center gap-4
                  py-3.5 first:pt-0 last:pb-0
                "
              >
                <div
                  className="
                    w-16 h-16 sm:w-20 sm:h-20
                    rounded-xl overflow-hidden
                    bg-cream shrink-0
                  "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-mist mt-0.5">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold text-ink shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ---- Custom Order Details ---- */}
      {isCustom && (
        <SectionCard title="Custom Order Details">
          <div className="space-y-5">
            {/* Reference Image */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div
                className="
                  w-full sm:w-48
                  aspect-square sm:aspect-auto sm:h-48
                  rounded-xl overflow-hidden
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
                    <HiPhotograph className="w-10 h-10 text-mist" />
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div
                className="
                  flex-1
                  grid grid-cols-2 gap-x-4 gap-y-3
                  content-start
                "
              >
                {[
                  { label: 'Style', value: order.sketchStyle },
                  { label: 'Size', value: order.canvasSize },
                  { label: 'Color', value: order.colorStyle },
                  { label: 'Frame', value: order.framingOption },
                  { label: 'Background', value: order.backgroundPreference },
                  { label: 'Subjects', value: order.numberOfSubjects },
                ].map(
                  (detail) =>
                    detail.value && (
                      <div key={detail.label}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-mist">
                          {detail.label}
                        </p>
                        <p className="text-sm font-semibold text-ink mt-0.5">
                          {detail.value}
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {order.additionalNotes && (
              <div className="p-4 rounded-xl bg-cream/40 border border-cream">
                <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-1.5">
                  Notes
                </p>
                <p className="text-sm text-charcoal leading-relaxed">
                  {order.additionalNotes}
                </p>
              </div>
            )}

            {/* Final Artwork */}
            {order.finalImage?.url && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-2.5">
                  Final Artwork
                </p>
                <div
                  className="
                    rounded-xl overflow-hidden
                    border-2 border-sage/20
                    shadow-md shadow-sage/5
                  "
                >
                  <img
                    src={order.finalImage.url}
                    alt="Final artwork"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Progress Images */}
            {order.progressImages?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-3">
                  Progress
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {order.progressImages.map((img, i) => (
                    <div
                      key={i}
                      className="
                        group/prog
                        rounded-xl overflow-hidden
                        border border-cream
                        hover-lift cursor-pointer
                      "
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.stage}
                          className="
                            w-full h-full object-cover
                            group-hover/prog:scale-110
                            transition-transform duration-500
                          "
                        />
                      </div>
                      <div className="px-3 py-2 bg-cream/30">
                        <p className="text-xs font-semibold text-charcoal capitalize">
                          {img.stage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ---- Payment Summary ---- */}
      <SectionCard title="Payment Summary">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-mist">Subtotal</span>
            <span className="text-sm font-semibold text-ink">
              ${order.subtotal?.toFixed(2)}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-sage">Discount</span>
              <span className="text-sm font-semibold text-sage">
                -${order.discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-mist">Shipping</span>
            <span className="text-sm font-semibold text-ink">
              {(order.shippingCost || 0) === 0
                ? 'Free'
                : `$${(order.shippingCost || 0).toFixed(2)}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-mist">Tax</span>
            <span className="text-sm font-semibold text-ink">
              ${(order.tax || 0).toFixed(2)}
            </span>
          </div>

          <div className="h-px bg-cream !my-3" />

          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-ink">Total</span>
            <span className="text-xl font-black text-ink tracking-tight">
              ${order.totalAmount?.toFixed(2)}
            </span>
          </div>

          <div className="pt-2">
            <Badge variant={statusVariants[order.paymentStatus]}>
              Payment: {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </SectionCard>

      {/* ---- Shipping Address ---- */}
      {order.shippingAddress && (
        <SectionCard title="Shipping Address">
          <div className="text-sm text-charcoal leading-relaxed">
            <p className="font-semibold text-ink">
              {order.shippingAddress.street}
            </p>
            <p className="mt-0.5">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="mt-0.5">{order.shippingAddress.country}</p>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t border-cream">
              <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-1.5">
                Tracking Number
              </p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-mono font-semibold text-ink">
                  {order.trackingNumber}
                </p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-1
                      text-xs font-semibold text-rust
                      hover:text-gold
                      transition-colors duration-300 cursor-pointer
                    "
                  >
                    Track
                    <HiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* ---- Timeline ---- */}
      {order.statusHistory?.length > 0 && (
        <OrderTimeline statusHistory={order.statusHistory} />
      )}
    </div>
  );
}