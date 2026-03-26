import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import {
  HiUser, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash,
  HiSparkles, HiExclamationCircle, HiArrowRight, HiCheckCircle
} from 'react-icons/hi2';

const passwordStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthConfig = [
  { label: 'Very Weak', color: 'bg-red-400' },
  { label: 'Weak', color: 'bg-[var(--color-rust)]' },
  { label: 'Fair', color: 'bg-[var(--color-gold)]' },
  { label: 'Good', color: 'bg-[var(--color-sage)]' },
  { label: 'Strong', color: 'bg-emerald-500' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const pwdStrength = passwordStrength(form.password);
  const pwdMismatch = form.password && form.confirmPassword && form.password !== form.confirmPassword;
  const pwdMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4 py-12 sm:py-16 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-rust)]/6 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-sage)]/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[var(--color-gold)]/4 blur-3xl" />

        {/* Decorative grid dots */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(var(--color-mist) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo / brand mark */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-ink)] shadow-xl shadow-[var(--color-ink)]/20 mb-4">
            <HiSparkles className="w-7 h-7 text-[var(--color-gold)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
            Create Account
          </h1>
          <p className="text-[var(--color-charcoal)]/60 text-sm sm:text-base mt-2">
            Join <span className="font-semibold text-gradient">SketchMint</span> and discover amazing art
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)] rounded-3xl shadow-2xl shadow-[var(--color-ink)]/8 overflow-hidden animate-scale-in">

          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-rust)] via-[var(--color-gold)] to-[var(--color-sage)]" />

          <div className="p-7 sm:p-9">

            {/* Error alert */}
            {error && (
              <div className="mb-5 flex items-start gap-3 bg-[var(--color-rust)]/8 border border-[var(--color-rust)]/20 text-[var(--color-rust)] rounded-xl px-4 py-3.5 animate-fade-in">
                <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* First + Last name row */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1.5 animate-fade-in-up stagger-1">
                  <label className="block text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide">
                    First Name
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/40 border border-[var(--color-mist)]/40 rounded-xl text-sm text-[var(--color-ink)] placeholder-[var(--color-mist)] focus:outline-none focus:border-[var(--color-ink)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5 animate-fade-in-up stagger-2">
                  <label className="block text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide">
                    Last Name
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/40 border border-[var(--color-mist)]/40 rounded-xl text-sm text-[var(--color-ink)] placeholder-[var(--color-mist)] focus:outline-none focus:border-[var(--color-ink)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 animate-fade-in-up stagger-3">
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/40 border border-[var(--color-mist)]/40 rounded-xl text-sm text-[var(--color-ink)] placeholder-[var(--color-mist)] focus:outline-none focus:border-[var(--color-ink)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 animate-fade-in-up stagger-4">
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-3 bg-[var(--color-cream)]/40 border border-[var(--color-mist)]/40 rounded-xl text-sm text-[var(--color-ink)] placeholder-[var(--color-mist)] focus:outline-none focus:border-[var(--color-ink)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mist)] hover:text-[var(--color-charcoal)] transition-colors duration-200 p-0.5"
                  >
                    {showPassword ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {form.password && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength ? strengthConfig[pwdStrength - 1]?.color : 'bg-[var(--color-cream)]'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${pwdStrength <= 1 ? 'text-red-400' : pwdStrength <= 2 ? 'text-[var(--color-rust)]' : pwdStrength <= 3 ? 'text-[var(--color-gold)]' : 'text-[var(--color-sage)]'}`}>
                      {strengthConfig[pwdStrength - 1]?.label || ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 animate-fade-in-up stagger-5">
                <label className="block text-xs font-semibold text-[var(--color-charcoal)] uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Repeat your password"
                    required
                    className={`w-full pl-10 pr-11 py-3 bg-[var(--color-cream)]/40 border rounded-xl text-sm text-[var(--color-ink)] placeholder-[var(--color-mist)] focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${pwdMismatch
                      ? 'border-[var(--color-rust)]/50 focus:border-[var(--color-rust)] focus:ring-[var(--color-rust)]/10'
                      : pwdMatch
                        ? 'border-[var(--color-sage)]/50 focus:border-[var(--color-sage)] focus:ring-[var(--color-sage)]/10'
                        : 'border-[var(--color-mist)]/40 focus:border-[var(--color-ink)] focus:ring-[var(--color-ink)]/8'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-mist)] hover:text-[var(--color-charcoal)] transition-colors duration-200 p-0.5"
                  >
                    {showConfirm ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>

                  {/* Match indicator */}
                  {form.confirmPassword && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      {pwdMatch ? (
                        <HiCheckCircle className="w-4 h-4 text-[var(--color-sage)]" />
                      ) : (
                        <HiExclamationCircle className="w-4 h-4 text-[var(--color-rust)]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Mismatch message */}
                {pwdMismatch && (
                  <p className="text-xs font-medium text-[var(--color-rust)] flex items-center gap-1.5 animate-fade-in">
                    <HiExclamationCircle className="w-3.5 h-3.5" />
                    Passwords do not match
                  </p>
                )}
                {pwdMatch && (
                  <p className="text-xs font-medium text-[var(--color-sage)] flex items-center gap-1.5 animate-fade-in">
                    <HiCheckCircle className="w-3.5 h-3.5" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Terms note */}
              <p className="text-xs text-[var(--color-charcoal)]/50 text-center px-2 animate-fade-in-up stagger-6">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="cursor-pointer text-[var(--color-rust)] hover:underline font-medium">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="cursor-pointer text-[var(--color-rust)] hover:underline font-medium">Privacy Policy</Link>.
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || pwdMismatch || !form.firstName || !form.email || !form.password || !form.confirmPassword}
                className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] font-semibold text-sm py-3.5 rounded-xl shadow-lg shadow-[var(--color-ink)]/20 hover:bg-[var(--color-charcoal)] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-ink)]/25 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 animate-fade-in-up stagger-7 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-7 sm:px-9 py-5 bg-[var(--color-cream)]/40 border-t border-[var(--color-cream)]">
            <p className="text-sm text-center text-[var(--color-charcoal)]/70">
              Already have an account?{' '}
              <Link
                to="/login"
                className="cursor-pointer font-semibold text-[var(--color-ink)] hover:text-[var(--color-rust)] transition-colors duration-200 underline underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 animate-fade-in-up stagger-8">
          {['🔒 Secure', '✨ Free to Join', '🎨 100+ Artists'].map((badge) => (
            <span key={badge} className="text-xs text-[var(--color-charcoal)]/50 font-medium">{badge}</span>
          ))}
        </div>
      </div>
    </div>
  );
}