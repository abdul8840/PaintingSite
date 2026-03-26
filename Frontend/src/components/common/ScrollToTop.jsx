import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';
import {
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
  HiExclamation,
  HiX,
} from 'react-icons/hi';

const config = {
  success: {
    icon: HiCheckCircle,
    bg: 'bg-sage/10 border-sage/25',
    iconColor: 'text-sage',
    bar: 'bg-sage',
  },
  error: {
    icon: HiXCircle,
    bg: 'bg-rust/10 border-rust/25',
    iconColor: 'text-rust',
    bar: 'bg-rust',
  },
  info: {
    icon: HiInformationCircle,
    bg: 'bg-mist/15 border-mist/30',
    iconColor: 'text-charcoal',
    bar: 'bg-charcoal',
  },
  warning: {
    icon: HiExclamation,
    bg: 'bg-gold/10 border-gold/25',
    iconColor: 'text-gold',
    bar: 'bg-gold',
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

  const { icon: Icon, bg, iconColor, bar } =
    config[toast.type] || config.info;

  return (
    <div
      className="
        fixed top-4 right-4 left-4 sm:left-auto
        sm:min-w-[360px] sm:max-w-md
        z-[300]
        animate-slide-in-toast
      "
    >
      <div
        className={`
          relative overflow-hidden
          flex items-start gap-3
          px-4 py-3.5
          rounded-2xl border
          shadow-xl shadow-ink/10
          ${bg}
        `}
      >
        {/* Icon */}
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />

        {/* Message */}
        <span className="flex-1 text-sm font-medium text-ink leading-relaxed pr-6">
          {toast.message}
        </span>

        {/* Close */}
        <button
          onClick={() => dispatch(hideToast())}
          className="
            absolute top-3 right-3
            p-1 rounded-lg
            text-mist hover:text-ink hover:bg-ink/5
            transition-all duration-200 cursor-pointer
            active:scale-90
          "
          aria-label="Dismiss"
        >
          <HiX className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div
          className={`
            absolute bottom-0 left-0 h-0.5
            ${bar}
            animate-toast-progress
          `}
        />
      </div>
    </div>
  );
}