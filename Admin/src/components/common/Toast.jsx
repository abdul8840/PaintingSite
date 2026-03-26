import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi';

const icons = { success: HiCheckCircle, error: HiXCircle, info: HiInformationCircle, warning: HiInformationCircle };

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(hideToast()), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const Icon = icons[toast.type] || icons.info;

  return (
    <div data-type={toast.type}>
      <Icon />
      <span>{toast.message}</span>
      <button onClick={() => dispatch(hideToast())}><HiX /></button>
    </div>
  );
}