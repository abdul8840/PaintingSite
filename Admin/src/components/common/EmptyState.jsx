export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-12 sm:py-16 lg:py-20
      px-4
      text-center
      animate-fadeIn
    ">
      {Icon && (
        <div className="
          w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
          mb-4 sm:mb-6
          bg-bg-tertiary
          rounded-full
          flex items-center justify-center
          text-text-muted
        ">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
        </div>
      )}
      <h3 className="
        text-lg sm:text-xl lg:text-2xl
        font-semibold
        text-text-primary
        mb-2
      ">
        {title}
      </h3>
      {description && (
        <p className="
          text-sm sm:text-base
          text-text-secondary
          max-w-md
          leading-relaxed
        ">
          {description}
        </p>
      )}
    </div>
  );
}