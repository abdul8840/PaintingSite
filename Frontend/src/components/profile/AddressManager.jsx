import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
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
    <div>
      <div>
        <h3>Saved Addresses</h3>
        <button onClick={() => { setShowForm(true); setEditingAddress(null); }}><HiPlus /> Add Address</button>
      </div>

      {(showForm || editingAddress) && (
        <AddressForm
          address={editingAddress}
          onSubmit={editingAddress ? handleUpdate : handleAdd}
          onCancel={() => { setShowForm(false); setEditingAddress(null); }}
        />
      )}

      {addresses.length === 0 ? (
        <p>No saved addresses</p>
      ) : (
        <div>
          {addresses.map((addr) => (
            <div key={addr._id}>
              {addr.isDefault && <span>Default</span>}
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} {addr.zipCode}</p>
              <p>{addr.country}</p>
              <div>
                <button onClick={() => { setEditingAddress(addr); setShowForm(false); }}><HiPencil /></button>
                <button onClick={() => handleDelete(addr._id)}><HiTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}