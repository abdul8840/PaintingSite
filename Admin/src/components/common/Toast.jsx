import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamation, HiX } from 'react-icons/hi';

const toastConfig = {
  success: {
    icon: HiCheckCircle,
    bg: 'bg-success-bg',
    border: 'border-success',
    iconColor: 'text-success',
    textColor: 'text-[var(--color-success-text)]',
  },
  error: {
    icon: HiXCircle,
    bg: 'bg-error-bg',
    border: 'border-error',
    iconColor: 'text-error',
    textColor: 'text-[var(--color-error-text)]',
  },
  info: {
    icon: HiInformationCircle,
    bg: 'bg-info-bg',
    border: 'border-info',
    iconColor: 'text-info',
    textColor: 'text-[var(--color-info-text)]',
  },
  warning: {
    icon: HiExclamation,
    bg: 'bg-warning-bg',
    border: 'border-warning',
    iconColor: 'text-warning',
    textColor: 'text-[var(--color-warning-text)]',
  },
};

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

  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className="
      fixed bottom-4 right-4 sm:bottom-6 sm:right-6
      z-[100]
      max-w-sm sm:max-w-md
      w-[calc(100%-2rem)] sm:w-auto
      animate-slideIn
    ">
      <div className={`
        flex items-start gap-3
        px-4 py-3
        ${config.bg}
        border-l-4 ${config.border}
        rounded-lg
        shadow-lg
      `}>
        <Icon className={`
          flex-shrink-0
          w-5 h-5
          ${config.iconColor}
          mt-0.5
        `} />
        
        <span className={`
          flex-1
          text-sm font-medium
          ${config.textColor}
        `}>
          {toast.message}
        </span>
        
        <button 
          onClick={() => dispatch(hideToast())}
          className={`
            flex-shrink-0
            p-1
            rounded
            ${config.textColor}
            hover:bg-black/10
            transition-colors duration-200
            cursor-pointer
          `}
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}