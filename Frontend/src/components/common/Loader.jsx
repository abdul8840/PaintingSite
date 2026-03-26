export default function Loader({ size = 'default', text = '' }) {
  const sizes = {
    small: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-[3px]',
    large: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  };

  const containerSizes = {
    small: 'py-4',
    default: 'py-12',
    large: 'py-20',
    xl: 'py-28',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        ${containerSizes[size] || containerSizes.default}
        animate-fade-in
      `}
    >
      {/* Spinner */}
      <div className="relative">
        {/* Track */}
        <div
          className={`
            ${sizes[size] || sizes.default}
            rounded-full
            border-cream
          `}
        />
        {/* Spinning part */}
        <div
          className={`
            absolute inset-0
            ${sizes[size] || sizes.default}
            rounded-full
            border-transparent border-t-rust border-r-rust/30
            animate-spin
          `}
        />
      </div>

      {/* Text */}
      {text && (
        <p className="text-sm text-mist font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}