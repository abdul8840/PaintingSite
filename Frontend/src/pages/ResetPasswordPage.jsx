import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { useToast } from '../hooks/useToast';
import {
  HiLockClosed, HiEye, HiEyeSlash, HiShieldCheck,
  HiArrowRight, HiSparkles, HiExclamationCircle, HiCheckCircle
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
  { label: 'Weak',      color: 'bg-[var(--color-rust)]' },
  { label: 'Fair',      color: 'bg-[var(--color-gold)]' },
  { label: 'Good',      color: 'bg-[var(--color-sage)]' },
  { label: 'Strong',    color: 'bg-emerald-500' },
];

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const [loading, setLoading]     = useState(false);

  const pwdStrength = passwordStrength(password);
  const pwdMismatch = password && confirm && password !== confirm;
  const pwdMatch    = password && confirm && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(token, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center
                    px-4 py-12 sm:py-20 relative overflow-hidden">

      {/* ── Background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                        bg-[var(--color-rust)]/6 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full
                        bg-[var(--color-sage)]/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-64 h-64 rounded-full bg-[var(--color-gold)]/4 blur-3xl" />
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(var(--color-mist) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      {/* Floating dots */}
      <span className="absolute top-16 left-10 w-3 h-3 rounded-full
                       bg-[var(--color-gold)]/40 animate-float hidden sm:block" />
      <span className="absolute top-28 right-14 w-2 h-2 rounded-full
                       bg-[var(--color-rust)]/40 animate-float stagger-3 hidden sm:block" />
      <span className="absolute bottom-20 left-20 w-2 h-2 rounded-full
                       bg-[var(--color-sage)]/40 animate-float stagger-5 hidden sm:block" />

      <div className="w-full max-w-md relative z-10">

        {/* Brand mark */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-[var(--color-ink)] shadow-xl shadow-[var(--color-ink)]/20 mb-4
                          relative">
            <HiShieldCheck className="w-7 h-7 text-[var(--color-gold)]" />
            {/* pulse ring */}
            <span className="absolute inset-0 rounded-2xl border-2
                             border-[var(--color-gold)]/30 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
            Reset Password
          </h1>
          <p className="text-[var(--color-charcoal)]/60 text-sm mt-2 max-w-xs mx-auto">
            Choose a strong new password to secure your{' '}
            <span className="font-semibold text-gradient">SketchMint</span> account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                        rounded-3xl shadow-2xl shadow-[var(--color-ink)]/8
                        overflow-hidden animate-scale-in">

          {/* Gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r
                          from-[var(--color-rust)] via-[var(--color-gold)]
                          to-[var(--color-sage)]" />

          <div className="p-7 sm:p-9">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* New Password */}
              <div className="space-y-1.5 animate-fade-in-up stagger-1">
                <label className="block text-xs font-semibold text-[var(--color-charcoal)]
                                   uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2
                                           w-4 h-4 text-[var(--color-mist)]" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-3 bg-[var(--color-cream)]/40
                               border border-[var(--color-mist)]/40 rounded-xl text-sm
                               text-[var(--color-ink)] placeholder-[var(--color-mist)]
                               focus:outline-none focus:border-[var(--color-ink)]
                               focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8
                               transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2
                               text-[var(--color-mist)] hover:text-[var(--color-charcoal)]
                               transition-colors duration-200 p-0.5"
                  >
                    {showPwd
                      ? <HiEyeSlash className="w-4 h-4" />
                      : <HiEye     className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="space-y-1.5 animate-fade-in pt-0.5">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300
                            ${i <= pwdStrength
                              ? strengthConfig[pwdStrength - 1]?.color
                              : 'bg-[var(--color-cream)]'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium
                      ${pwdStrength <= 1 ? 'text-red-400'
                        : pwdStrength <= 2 ? 'text-[var(--color-rust)]'
                        : pwdStrength <= 3 ? 'text-[var(--color-gold)]'
                        : 'text-[var(--color-sage)]'}`}>
                      {strengthConfig[pwdStrength - 1]?.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 animate-fade-in-up stagger-2">
                <label className="block text-xs font-semibold text-[var(--color-charcoal)]
                                   uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2
                                           w-4 h-4 text-[var(--color-mist)]" />
                  <input
                    type={showCfm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className={`w-full pl-10 pr-16 py-3 bg-[var(--color-cream)]/40
                               border rounded-xl text-sm text-[var(--color-ink)]
                               placeholder-[var(--color-mist)] focus:outline-none
                               focus:bg-white focus:ring-2 transition-all duration-200
                               ${pwdMismatch
                                 ? 'border-[var(--color-rust)]/50 focus:border-[var(--color-rust)] focus:ring-[var(--color-rust)]/10'
                                 : pwdMatch
                                   ? 'border-[var(--color-sage)]/50 focus:border-[var(--color-sage)] focus:ring-[var(--color-sage)]/10'
                                   : 'border-[var(--color-mist)]/40 focus:border-[var(--color-ink)] focus:ring-[var(--color-ink)]/8'}`}
                  />

                  {/* Match icon */}
                  {confirm && (
                    <span className="absolute right-10 top-1/2 -translate-y-1/2">
                      {pwdMatch
                        ? <HiCheckCircle      className="w-4 h-4 text-[var(--color-sage)]" />
                        : <HiExclamationCircle className="w-4 h-4 text-[var(--color-rust)]" />}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowCfm(v => !v)}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2
                               text-[var(--color-mist)] hover:text-[var(--color-charcoal)]
                               transition-colors duration-200 p-0.5"
                  >
                    {showCfm
                      ? <HiEyeSlash className="w-4 h-4" />
                      : <HiEye     className="w-4 h-4" />}
                  </button>
                </div>

                {pwdMismatch && (
                  <p className="text-xs font-medium text-[var(--color-rust)]
                                flex items-center gap-1.5 animate-fade-in">
                    <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Passwords do not match
                  </p>
                )}
                {pwdMatch && (
                  <p className="text-xs font-medium text-[var(--color-sage)]
                                flex items-center gap-1.5 animate-fade-in">
                    <HiCheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Tips */}
              <div className="bg-[var(--color-cream)]/60 border border-[var(--color-mist)]/20
                              rounded-xl p-4 space-y-1.5 animate-fade-in-up stagger-3">
                <p className="text-xs font-semibold text-[var(--color-charcoal)]/70 mb-2">
                  Password tips:
                </p>
                {[
                  { rule: 'At least 6 characters', met: password.length >= 6 },
                  { rule: 'One uppercase letter',   met: /[A-Z]/.test(password) },
                  { rule: 'One number',             met: /[0-9]/.test(password) },
                  { rule: 'One special character',  met: /[^A-Za-z0-9]/.test(password) },
                ].map(({ rule, met }) => (
                  <div key={rule} className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                                     flex-shrink-0 transition-all duration-300
                                     ${met
                                       ? 'bg-[var(--color-sage)]/20'
                                       : 'bg-[var(--color-mist)]/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                                        ${met
                                          ? 'bg-[var(--color-sage)]'
                                          : 'bg-[var(--color-mist)]'}`} />
                    </span>
                    <span className={`text-xs transition-colors duration-300
                                     ${met
                                       ? 'text-[var(--color-sage)] font-medium'
                                       : 'text-[var(--color-charcoal)]/50'}`}>
                      {rule}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!pwdMismatch ||
                          !password || !confirm || password.length < 6}
                className="cursor-pointer w-full flex items-center justify-center gap-2
                           bg-[var(--color-ink)] text-[var(--color-paper)] font-semibold
                           text-sm py-3.5 rounded-xl shadow-lg shadow-[var(--color-ink)]/20
                           hover:bg-[var(--color-charcoal)] hover:-translate-y-0.5
                           hover:shadow-xl hover:shadow-[var(--color-ink)]/25
                           active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none transition-all duration-200
                           animate-fade-in-up stagger-4 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <HiArrowRight className="w-4 h-4 transition-transform duration-200
                                             group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-7 sm:px-9 py-4 bg-[var(--color-cream)]/40
                          border-t border-[var(--color-cream)]">
            <p className="text-xs text-center text-[var(--color-charcoal)]/50">
              🔒 Your connection is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}