import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import ChatBot from './components/chat/ChatBot';
import { checkAuthStatus } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <Toast />
      <ChatBot />
    </div>
  );
}

export default App;