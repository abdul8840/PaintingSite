import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="
        lg:pl-64
        transition-all duration-300
        min-h-screen
        flex flex-col
      ">
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <main className="
          flex-1
          p-4 sm:p-6 lg:p-8
          overflow-x-hidden
        ">
          <div className="
            max-w-7xl
            mx-auto
            animate-fadeIn
          ">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="
          px-4 sm:px-6 lg:px-8
          py-4
          border-t border-border-light
          bg-bg-primary
        ">
          <p className="text-center text-sm text-text-muted">
            © {new Date().getFullYear()} SketchMint Admin. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}