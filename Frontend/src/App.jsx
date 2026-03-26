import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import ChatBot from './components/chat/ChatBot';
import ErrorBoundary from './components/common/ErrorBoundary';
import { checkAuthStatus } from './store/slices/authSlice';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      {/* Page shell — flex column so footer always sticks to bottom */}
      <div className="flex flex-col min-h-screen bg-[var(--color-paper)]">
        <Header />
        {/* main grows to fill remaining space */}
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
      {/* Overlays — rendered outside the flow */}
      <Toast />
      <ChatBot />
    </ErrorBoundary>
  );
}

export default App;