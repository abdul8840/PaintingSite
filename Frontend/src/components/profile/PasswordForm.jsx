import { useState } from 'react';
import { HiLockClosed, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';
import userApi from '../../api/userApi';
import { useToast } from '../../hooks/useToast';

export default function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      await userApi.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-rust' };
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-gold' };
    return { strength, label: 'Strong', color: 'bg-sage' };
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-cream p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rust/20 to-rust/10 rounded-xl flex items-center justify-center">
          <HiLockClosed className="w-5 h-5 sm:w-6 sm:h-6 text-rust" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-ink">Change Password</h3>
          <p className="text-sm text-charcoal/60">Keep your account secure</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Current Password */}
        <div className="animate-fade-in-up stagger-1">
          <label className="block text-sm font-medium text-ink mb-2">
            Current Password
          </label>
          <div className="relative">
            <input 
              type={showPasswords.current ? 'text' : 'password'}
              value={form.currentPassword} 
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} 
              required 
              className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 pr-12 text-sm sm:text-base"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
            >
              {showPasswords.current ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="animate-fade-in-up stagger-2">
          <label className="block text-sm font-medium text-ink mb-2">
            New Password
          </label>
          <div className="relative">
            <input 
              type={showPasswords.new ? 'text' : 'password'}
              value={form.newPassword} 
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })} 
              required 
              minLength={6}
              className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 pr-12 text-sm sm:text-base"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
            >
              {showPasswords.new ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {form.newPassword && (
            <div className="mt-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.label === 'Weak' ? 'text-rust' : 
                  passwordStrength.label === 'Medium' ? 'text-gold' : 'text-sage'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <p className="text-xs text-charcoal/50">
                Use 8+ characters with uppercase, numbers & symbols
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="animate-fade-in-up stagger-3">
          <label className="block text-sm font-medium text-ink mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input 
              type={showPasswords.confirm ? 'text' : 'password'}
              value={form.confirmPassword} 
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
              required 
              className={`w-full px-4 py-3 sm:py-3.5 bg-paper border rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 transition-all duration-300 pr-12 text-sm sm:text-base ${
                form.confirmPassword && form.confirmPassword !== form.newPassword 
                  ? 'border-rust/50 focus:ring-rust/30 focus:border-rust' 
                  : form.confirmPassword && form.confirmPassword === form.newPassword
                  ? 'border-sage/50 focus:ring-sage/30 focus:border-sage'
                  : 'border-cream focus:ring-sage/30 focus:border-sage'
              }`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
            >
              {showPasswords.confirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
            </button>
          </div>
          {form.confirmPassword && form.confirmPassword !== form.newPassword && (
            <p className="mt-1.5 text-xs text-rust animate-fade-in">Passwords do not match</p>
          )}
          {form.confirmPassword && form.confirmPassword === form.newPassword && (
            <p className="mt-1.5 text-xs text-sage flex items-center gap-1 animate-fade-in">
              <HiShieldCheck className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4 animate-fade-in-up stagger-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <HiShieldCheck className="w-5 h-5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}