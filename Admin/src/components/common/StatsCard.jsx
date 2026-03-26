export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase', 
  subtitle 
}) {
  return (
    <div className="
      bg-bg-primary
      rounded-xl
      border border-border-light
      p-4 sm:p-5 lg:p-6
      shadow-sm
      hover:shadow-md
      transition-shadow duration-200
    ">
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="
            text-xs sm:text-sm
            font-medium
            text-text-secondary
            uppercase
            tracking-wider
            truncate
          ">
            {title}
          </p>
          
          <h3 className="
            mt-1 sm:mt-2
            text-xl sm:text-2xl lg:text-3xl
            font-bold
            text-text-primary
            truncate
          ">
            {value}
          </h3>
          
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`
                inline-flex items-center
                px-1.5 sm:px-2 py-0.5
                text-xs font-medium
                rounded-full
                ${changeType === 'increase' 
                  ? 'bg-success-bg text-[var(--color-success-text)]' 
                  : 'bg-error-bg text-[var(--color-error-text)]'
                }
              `}>
                {changeType === 'increase' ? '↑' : '↓'} {change}%
              </span>
            </div>
          )}
          
          {subtitle && (
            <p className="
              mt-2
              text-xs sm:text-sm
              text-text-muted
              truncate
            ">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon */}
        {Icon && (
          <div className="
            flex-shrink-0
            w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14
            bg-bg-tertiary
            rounded-xl
            flex items-center justify-center
          ">
            <Icon className="
              w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
              text-text-secondary
            " />
          </div>
        )}
      </div>
    </div>
  );
}