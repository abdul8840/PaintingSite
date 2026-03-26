import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../api/authApi';
import { useToast } from '../hooks/useToast';
import { HiMail, HiArrowLeft, HiCheckCircle, HiLockClosed } from 'react-icons/hi';

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
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12 sm:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-cream shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Logo/Icon */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <HiLockClosed className="w-8 h-8 sm:w-10 sm:h-10 text-gold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Forgot Password</h1>
            <p className="text-sm sm:text-base text-charcoal/60">
              {sent ? "Check your email" : "No worries, we'll send you reset instructions"}
            </p>
          </div>

          {sent ? (
            /* Success State */
            <div className="text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiCheckCircle className="w-10 h-10 text-sage" />
              </div>
              <p className="text-charcoal/70 mb-6">
                We've sent a password reset link to <strong className="text-ink">{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              <p className="text-sm text-charcoal/50 mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setSent(false)}
                  className="w-full px-6 py-3 bg-paper text-ink rounded-xl font-medium hover:bg-cream transition-all duration-300 cursor-pointer"
                >
                  Try Another Email
                </button>
                <Link 
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 cursor-pointer"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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

              <div className="animate-fade-in-up stagger-2">
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 animate-fade-in-up stagger-3">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-ink transition-colors cursor-pointer"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-charcoal/50 mt-6">
          Need help? <a href="/contact" className="text-sage hover:underline cursor-pointer">Contact Support</a>
        </p>
      </div>
    </div>
  );
}