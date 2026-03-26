import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import AddressManager from '../components/profile/AddressManager';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  return (
    <div>
      <Breadcrumb items={[{ label: 'Profile' }]} />
      <h1>My Profile</h1>

      <div>
        <button onClick={() => setTab('profile')} data-active={tab === 'profile'}>Profile</button>
        <button onClick={() => setTab('addresses')} data-active={tab === 'addresses'}>Addresses</button>
        <button onClick={() => setTab('password')} data-active={tab === 'password'}>Password</button>
      </div>

      {tab === 'profile' && <ProfileForm user={user} />}
      {tab === 'addresses' && <AddressManager addresses={user.addresses} />}
      {tab === 'password' && <PasswordForm />}
    </div>
  );
}