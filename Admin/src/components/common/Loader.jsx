export default function Loader({ text = 'Loading...', size = 'default' }) {
  const sizes = {
    small: 'w-6 h-6 border-2',
    default: 'w-10 h-10 sm:w-12 sm:h-12 border-3',
    large: 'w-14 h-14 sm:w-16 sm:h-16 border-4',
  };

  const textSizes = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  };

  return (
    <div className="
      flex flex-col items-center justify-center
      py-8 sm:py-12
      animate-fadeIn
    ">
      <div className={`
        ${sizes[size]}
        border-bg-tertiary
        border-t-theme-primary
        rounded-full
        animate-spin
        mb-3 sm:mb-4
      `} />
      <p className={`
        ${textSizes[size]}
        text-text-secondary
        font-medium
      `}>
        {text}
      </p>
    </div>
  );
}