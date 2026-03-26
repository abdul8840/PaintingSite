import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import AddressManager from '../components/profile/AddressManager';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiUser, HiMapPin, HiLockClosed, HiChevronRight } from 'react-icons/hi2';

const tabs = [
  {
    key: 'profile',
    label: 'Profile',
    icon: HiUser,
    description: 'Personal info & preferences',
  },
  {
    key: 'addresses',
    label: 'Addresses',
    icon: HiMapPin,
    description: 'Saved delivery addresses',
  },
  {
    key: 'password',
    label: 'Password',
    icon: HiLockClosed,
    description: 'Security & login settings',
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  const activeTab = tabs.find(t => t.key === tab);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] pb-16">

      {/* Page header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[var(--color-cream)] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Profile' }]} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Page title */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--color-rust)] to-[var(--color-gold)] flex items-center justify-center shadow-lg shadow-[var(--color-rust)]/20 flex-shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--color-sage)] rounded-full border-2 border-[var(--color-paper)] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Profile'}
              </h1>
              <p className="text-sm text-[var(--color-charcoal)]/60 mt-0.5">{user?.email || 'Manage your account settings'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar tabs — desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-cream)] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
              {tabs.map((t, i) => {
                const Icon = t.icon;
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`cursor-pointer w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-200 group relative ${i !== 0 ? 'border-t border-[var(--color-cream)]' : ''} ${isActive
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                      : 'hover:bg-[var(--color-cream)]/60 text-[var(--color-charcoal)]'
                      }`}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-rust)] to-[var(--color-gold)]" />
                    )}

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isActive
                      ? 'bg-white/15'
                      : 'bg-[var(--color-cream)] group-hover:bg-[var(--color-mist)]/30'
                      }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-paper)]' : 'text-[var(--color-charcoal)]'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? 'text-[var(--color-paper)]' : 'text-[var(--color-ink)]'}`}>
                        {t.label}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-[var(--color-paper)]/60' : 'text-[var(--color-mist)]'}`}>
                        {t.description}
                      </p>
                    </div>

                    <HiChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-[var(--color-paper)]/60 translate-x-0.5' : 'text-[var(--color-mist)] group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick info card */}
            <div className="mt-4 bg-gradient-to-br from-[var(--color-ink)] to-[var(--color-charcoal)] rounded-2xl p-5 text-[var(--color-paper)] shadow-lg animate-fade-in-up stagger-2">
              <p className="text-xs text-[var(--color-mist)] mb-1">Member since</p>
              <p className="text-sm font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'SketchMint Member'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-[var(--color-mist)]">Account type</p>
                <p className="text-sm font-semibold capitalize mt-0.5">{user?.role || 'Customer'}</p>
              </div>
            </div>
          </aside>

          {/* Mobile tab bar */}
          <div className="lg:hidden animate-fade-in-up">
            <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-cream)] rounded-2xl p-1.5 flex gap-1 shadow-sm">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`cursor-pointer flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)] shadow-md'
                      : 'text-[var(--color-charcoal)]/60 hover:bg-[var(--color-cream)]/60'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="lg:col-span-3 animate-fade-in-up stagger-2">

            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              {(() => {
                const Icon = activeTab?.icon;
                return Icon ? (
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-ink)] flex items-center justify-center shadow-md flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-paper)]" />
                  </div>
                ) : null;
              })()}
              <div>
                <h2 className="text-lg font-bold text-[var(--color-ink)]">{activeTab?.label}</h2>
                <p className="text-xs text-[var(--color-charcoal)]/50">{activeTab?.description}</p>
              </div>
            </div>

            {/* Tab content with transition */}
            <div
              key={tab}
              className="animate-scale-in bg-white/80 backdrop-blur-sm border border-[var(--color-cream)] rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)] via-[var(--color-gold)] to-[var(--color-sage)]" />
              <div className="p-6 sm:p-8">
                {tab === 'profile' && <ProfileForm user={user} />}
                {tab === 'addresses' && <AddressManager addresses={user?.addresses} />}
                {tab === 'password' && <PasswordForm />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}