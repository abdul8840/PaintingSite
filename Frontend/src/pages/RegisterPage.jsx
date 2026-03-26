import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (form.password !== form.confirmPassword) return;
    const result = await dispatch(registerUser(form));
    if (result.type.endsWith('/fulfilled')) navigate('/');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div>
      <div>
        <h1>Create Account</h1>
        <p>Join SketchMint and discover amazing art</p>

        {error && <div>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <p>Passwords do not match</p>
          )}
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>

        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}