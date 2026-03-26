import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <div>
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}