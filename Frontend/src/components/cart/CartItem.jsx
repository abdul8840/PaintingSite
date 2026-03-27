// CartItem.jsx
import { Link } from 'react-router-dom';
import { HiTrash, HiPlus, HiMinus, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';
import { useState } from 'react';

export default function CartItem({ item }) {
  const { update, remove } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      remove(item._id);
    }, 300);
  };

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    await update(item._id, newQuantity);
    setTimeout(() => setIsUpdating(false), 200);
  };

  return (
    <div 
      className={`group bg-white rounded-2xl border border-cream overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-ink/5 hover:border-sage/30 ${
        isRemoving ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100 translate-x-0'
      }`}
    >
      {/* Mobile Layout */}
      <div className="sm:hidden p-4">
        <div className="flex gap-4">
          {/* Image */}
          <Link 
            to={`/artwork/${item.slug}`}
            className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 group/image"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
          </Link>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link 
              to={`/artwork/${item.slug}`}
              className="block"
            >
              <h3 className="font-semibold text-ink text-sm leading-tight hover:text-rust transition-colors duration-300 line-clamp-2">
                {item.title}
              </h3>
            </Link>
            
            {item.artist && (
              <p className="text-xs text-charcoal/50 mt-1">
                by <span className="text-charcoal/70">{item.artist.firstName} {item.artist.lastName}</span>
              </p>
            )}
            
            <p className="text-rust font-bold text-sm mt-2">
              {formatPrice(item.price)}
            </p>
          </div>
          
          {/* Remove Button - Mobile */}
          <button 
            onClick={handleRemove}
            className="self-start p-2 text-charcoal/30 hover:text-rust hover:bg-rust/10 rounded-lg transition-all duration-300 cursor-pointer"
            aria-label="Remove item"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
        
        {/* Bottom Row - Mobile */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-cream/50 rounded-xl p-1">
            <button 
              onClick={() => handleQuantityChange(item.quantity - 1)} 
              disabled={item.quantity <= 1 || isUpdating}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-charcoal transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Decrease quantity"
            >
              <HiMinus className="w-3 h-3" />
            </button>
            
            <span className={`w-10 text-center font-semibold text-ink text-sm transition-all duration-200 ${
              isUpdating ? 'scale-110 text-sage' : 'scale-100'
            }`}>
              {item.quantity}
            </span>
            
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)} 
              disabled={item.quantity >= item.stock || isUpdating}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-charcoal transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Increase quantity"
            >
              <HiPlus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Total */}
          <div className="text-right">
            <p className="text-xs text-charcoal/50">Total</p>
            <p className="font-bold text-ink">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-12 gap-4 p-5 items-center">
        {/* Product Info - 6 cols */}
        <div className="col-span-6 flex items-center gap-4">
          <Link 
            to={`/artwork/${item.slug}`}
            className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden flex-shrink-0 group/image"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
            
            {/* Quick View Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-ink">
                View
              </span>
            </div>
          </Link>
          
          <div className="min-w-0 flex-1">
            <Link 
              to={`/artwork/${item.slug}`}
              className="block"
            >
              <h3 className="font-semibold text-ink hover:text-rust transition-colors duration-300 line-clamp-1 lg:line-clamp-2">
                {item.title}
              </h3>
            </Link>
            
            {item.artist && (
              <p className="text-sm text-charcoal/50 mt-1">
                by <span className="text-charcoal/70 hover:text-rust transition-colors cursor-pointer">
                  {item.artist.firstName} {item.artist.lastName}
                </span>
              </p>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center gap-2 mt-2">
              {item.stock <= 5 && item.stock > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rust/10 text-rust text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-rust rounded-full animate-pulse" />
                  Only {item.stock} left
                </span>
              )}
              {item.stock > 5 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-sage rounded-full" />
                  In Stock
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Unit Price - 2 cols */}
        <div className="col-span-2 text-center">
          <p className="font-semibold text-ink">
            {formatPrice(item.price)}
          </p>
        </div>
        
        {/* Quantity Controls - 2 cols */}
        <div className="col-span-2 flex justify-center">
          <div className="inline-flex items-center gap-1 bg-cream/50 rounded-xl p-1">
            <button 
              onClick={() => handleQuantityChange(item.quantity - 1)} 
              disabled={item.quantity <= 1 || isUpdating}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-charcoal transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              aria-label="Decrease quantity"
            >
              <HiMinus className="w-3.5 h-3.5" />
            </button>
            
            <span className={`w-10 text-center font-bold text-ink transition-all duration-200 ${
              isUpdating ? 'scale-125 text-sage' : 'scale-100'
            }`}>
              {item.quantity}
            </span>
            
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)} 
              disabled={item.quantity >= item.stock || isUpdating}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-charcoal hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-charcoal transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              aria-label="Increase quantity"
            >
              <HiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Total & Actions - 2 cols */}
        <div className="col-span-2 flex items-center justify-end gap-3">
          <p className="font-bold text-ink text-lg">
            {formatPrice(item.price * item.quantity)}
          </p>
          
          <button 
            onClick={handleRemove}
            className="p-2.5 text-charcoal/30 hover:text-rust hover:bg-rust/10 rounded-xl transition-all duration-300 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Remove item"
          >
            <HiTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}