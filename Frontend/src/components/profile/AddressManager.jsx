import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiPencil, HiTrash, HiPlus, HiLocationMarker, HiBadgeCheck } from 'react-icons/hi';
import AddressForm from '../checkout/AddressForm';
import userApi from '../../api/userApi';
import { updateUserData } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';

export default function AddressManager({ addresses = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleAdd = async (data) => {
    try {
      const res = await userApi.addAddress(data);
      dispatch(updateUserData({ addresses: res.addresses }));
      setShowForm(false);
      toast.success('Address added!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const res = await userApi.updateAddress(editingAddress._id, data);
      dispatch(updateUserData({ addresses: res.addresses }));
      setEditingAddress(null);
      toast.success('Address updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await userApi.deleteAddress(id);
      dispatch(updateUserData({ addresses: res.addresses }));
      toast.success('Address deleted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sage/20 to-sage/10 rounded-xl flex items-center justify-center">
            <HiLocationMarker className="w-5 h-5 sm:w-6 sm:h-6 text-sage" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-ink">Saved Addresses</h3>
            <p className="text-sm text-charcoal/60">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
          </div>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingAddress(null); }}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Address</span>
        </button>
      </div>

      {/* Address Form Modal */}
      {(showForm || editingAddress) && (
        <div className="mb-6 lg:mb-8 animate-fade-in-up">
          <div className="bg-cream/50 rounded-xl p-4 sm:p-6 border border-cream">
            <AddressForm
              address={editingAddress}
              onSubmit={editingAddress ? handleUpdate : handleAdd}
              onCancel={() => { setShowForm(false); setEditingAddress(null); }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 sm:py-16 animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <HiLocationMarker className="w-8 h-8 sm:w-10 sm:h-10 text-mist" />
          </div>
          <p className="text-charcoal/60 text-base sm:text-lg mb-2">No saved addresses</p>
          <p className="text-charcoal/40 text-sm">Add your first address to speed up checkout</p>
        </div>
      ) : (
        /* Address Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {addresses.map((addr, index) => (
            <div 
              key={addr._id}
              className={`group relative bg-paper rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:border-sage/30 p-4 sm:p-5 animate-fade-in-up ${addr.isDefault ? 'border-sage/50' : 'border-cream'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Default Badge */}
              {addr.isDefault && (
                <div className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-sage text-white text-xs font-medium rounded-full shadow-lg shadow-sage/30">
                    <HiBadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Default</span>
                  </span>
                </div>
              )}

              {/* Address Content */}
              <div className="pr-12 sm:pr-16">
                <p className="text-ink font-medium text-sm sm:text-base mb-1">{addr.street}</p>
                <p className="text-charcoal/70 text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-charcoal/60 text-sm">{addr.country}</p>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => { setEditingAddress(addr); setShowForm(false); }}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-charcoal hover:text-sage hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                  aria-label="Edit address"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(addr._id)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-charcoal hover:text-rust hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                  aria-label="Delete address"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}