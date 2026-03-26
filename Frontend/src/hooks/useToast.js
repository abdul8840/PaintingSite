import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  return {
    success: (message) => dispatch(showToast({ message, type: 'success' })),
    error: (message) => dispatch(showToast({ message, type: 'error' })),
    info: (message) => dispatch(showToast({ message, type: 'info' })),
    warning: (message) => dispatch(showToast({ message, type: 'warning' })),
  };
};