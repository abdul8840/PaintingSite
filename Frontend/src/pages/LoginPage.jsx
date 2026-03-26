import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiExclamationCircle, HiSparkles } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));
    if (result.type.endsWith('/fulfilled')) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ink rounded-xl flex items-center justify-center">
                <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-ink">SketchMint</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-charcoal/60">Sign in to your SketchMint account</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-cream shadow-xl p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-rust/10 border border-rust/20 rounded-xl mb-6 animate-fade-in">
                <HiExclamationCircle className="w-5 h-5 text-rust flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rust">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="animate-fade-in-up stagger-1">
                <label className="block text-sm font-medium text-ink mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <HiMail className="w-5 h-5 text-mist" />
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="animate-fade-in-up stagger-2">
                <label className="block text-sm font-medium text-ink mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <HiLockClosed className="w-5 h-5 text-mist" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end animate-fade-in-up stagger-3">
                <Link 
                  to="/forgot-password"
                  className="text-sm text-sage hover:text-sage/80 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="animate-fade-in-up stagger-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-charcoal/50">New to SketchMint?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link 
              to="/register"
              className="flex items-center justify-center w-full px-6 py-3.5 bg-paper text-ink border-2 border-cream rounded-xl font-semibold hover:border-ink hover:bg-ink hover:text-white transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-gold/10 to-rust/10" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center max-w-md animate-fade-in-up">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/80 backdrop-blur rounded-3xl shadow-xl flex items-center justify-center">
              <HiSparkles className="w-16 h-16 text-sage" />
            </div>
            <h2 className="text-3xl font-bold text-ink mb-4">Discover Unique Art</h2>
            <p className="text-charcoal/70 leading-relaxed">
              Join our community of art lovers and discover stunning original artworks from talented artists around the world.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-sage/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gold/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}