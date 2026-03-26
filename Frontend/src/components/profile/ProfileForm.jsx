import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiUser, HiMail, HiPhone, HiCheck } from 'react-icons/hi';
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-cream p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center">
          <HiUser className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-ink">Personal Information</h3>
          <p className="text-sm text-charcoal/60">Update your profile details</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
          <div className="animate-fade-in-up stagger-1">
            <label className="block text-sm font-medium text-ink mb-2">
              First Name
            </label>
            <div className="relative">
              <input 
                value={form.firstName} 
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                required 
                className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                placeholder="Enter first name"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="animate-fade-in-up stagger-2">
            <label className="block text-sm font-medium text-ink mb-2">
              Last Name
            </label>
            <div className="relative">
              <input 
                value={form.lastName} 
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                required 
                className="w-full px-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="animate-fade-in-up stagger-3">
          <label className="block text-sm font-medium text-ink mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <HiPhone className="w-5 h-5 text-mist" />
            </div>
            <input 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
          <p className="mt-1.5 text-xs text-charcoal/50">Optional - for order updates</p>
        </div>

        {/* Email (Disabled) */}
        <div className="animate-fade-in-up stagger-4">
          <label className="block text-sm font-medium text-ink mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <HiMail className="w-5 h-5 text-mist" />
            </div>
            <input 
              value={user.email} 
              disabled 
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-cream/50 border border-cream rounded-xl text-charcoal/60 cursor-not-allowed text-sm sm:text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded-full">
                <HiCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-charcoal/50">Email cannot be changed</p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4 animate-fade-in-up stagger-5">
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <HiCheck className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}