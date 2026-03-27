import { Link } from 'react-router-dom';
import { HiTrash, HiPlus, HiMinus } from 'react-icons/hi';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';

export default function CartItem({ item }) {
  const { update, remove } = useCart();

  return (
    <div>
      <Link to={`/artwork/${item.slug}`}>
        <img src={item.image} alt={item.title} />
      </Link>
      <div>
        <Link to={`/artwork/${item.slug}`}><h3>{item.title}</h3></Link>
        {item.artist && <p>by {item.artist.firstName} {item.artist.lastName}</p>}
        <p>{formatPrice(item.price)}</p>
      </div>
      <div>
        <button onClick={() => update(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><HiMinus /></button>
        <span>{item.quantity}</span>
        <button onClick={() => update(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}><HiPlus /></button>
      </div>
      <p>{formatPrice(item.price * item.quantity)}</p>
      <button onClick={() => remove(item._id)}><HiTrash /></button>
    </div>
  );
}