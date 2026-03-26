import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../api/authApi';
import { useToast } from '../hooks/useToast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Forgot Password</h1>
        {sent ? (
          <div>
            <p>We've sent a password reset link to your email.</p>
            <Link to="/login">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Enter your email and we'll send you a reset link.</p>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <Link to="/login">Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}