import Badge from '../common/Badge';
import OrderTimeline from './OrderTimeline';

export default function OrderDetails({ order, isCustom = false }) {
  return (
    <div>
      <div>
        <h2>Order {order.orderNumber}</h2>
        <Badge>{isCustom ? order.status : order.orderStatus}</Badge>
      </div>

      {/* Items or Custom Details */}
      {!isCustom ? (
        <div>
          <h3>Items</h3>
          {order.items?.map((item, i) => (
            <div key={i}>
              <img src={item.image} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>Custom Order Details</h3>
          <img src={order.referenceImage?.url} alt="Reference" />
          <div>
            <p>Style: {order.sketchStyle}</p>
            <p>Size: {order.canvasSize}</p>
            <p>Color: {order.colorStyle}</p>
            <p>Frame: {order.framingOption}</p>
            <p>Background: {order.backgroundPreference}</p>
            <p>Subjects: {order.numberOfSubjects}</p>
            {order.additionalNotes && <p>Notes: {order.additionalNotes}</p>}
          </div>
          {order.finalImage?.url && (
            <div>
              <h4>Final Artwork</h4>
              <img src={order.finalImage.url} alt="Final artwork" />
            </div>
          )}
          {order.progressImages?.length > 0 && (
            <div>
              <h4>Progress</h4>
              {order.progressImages.map((img, i) => (
                <div key={i}>
                  <img src={img.url} alt={img.stage} />
                  <p>{img.stage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Summary */}
      <div>
        <h3>Payment Summary</h3>
        <div><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
        {order.discount > 0 && <div><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
        <div><span>Shipping</span><span>${(order.shippingCost || 0).toFixed(2)}</span></div>
        <div><span>Tax</span><span>${(order.tax || 0).toFixed(2)}</span></div>
        <div><span>Total</span><span>${order.totalAmount?.toFixed(2)}</span></div>
        <p>Payment: {order.paymentStatus}</p>
      </div>

      {/* Shipping */}
      {order.shippingAddress && (
        <div>
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}

      {order.trackingNumber && (
        <div>
          <p>Tracking: {order.trackingNumber}</p>
          {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Track Package</a>}
        </div>
      )}

      <OrderTimeline statusHistory={order.statusHistory} />
    </div>
  );
}