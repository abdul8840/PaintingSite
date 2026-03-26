import { useState } from 'react';
import { useDispatch } from 'react-redux';
import userApi from '../../api/userApi';
import { updateUserData } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';

export default function ProfileForm({ user }) {
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userApi.updateProfile(form);
      dispatch(updateUserData(res.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Personal Information</h3>
      <div>
        <div>
          <label>First Name</label>
          <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        </div>
        <div>
          <label>Last Name</label>
          <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        </div>
      </div>
      <div>
        <label>Phone</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div>
        <label>Email</label>
        <input value={user.email} disabled />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
    </form>
  );
}