import { HiCheck } from 'react-icons/hi';

const steps = ['Address', 'Review', 'Payment'];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="w-full py-6 sm:py-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex items-center">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-2">
                {/* Circle */}
                <div
                  className={`
                    relative
                    w-10 h-10 sm:w-11 sm:h-11
                    rounded-xl
                    flex items-center justify-center
                    text-sm font-bold
                    transition-all duration-500
                    ${
                      isCompleted
                        ? 'bg-sage text-paper shadow-md shadow-sage/25'
                        : isActive
                          ? 'bg-ink text-paper shadow-lg shadow-ink/20 scale-110'
                          : 'bg-cream text-mist border border-cream'
                    }
                  `}
                >
                  {isCompleted ? (
                    <HiCheck className="w-5 h-5 animate-scale-in" />
                  ) : (
                    <span>{index + 1}</span>
                  )}

                  {/* Active pulse ring */}
                  {isActive && (
                    <span
                      className="
                        absolute inset-0 rounded-xl
                        border-2 border-ink/20
                        animate-ping opacity-40
                      "
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[10px] sm:text-xs font-semibold uppercase tracking-wider
                    transition-colors duration-300
                    ${
                      isCompleted
                        ? 'text-sage'
                        : isActive
                          ? 'text-ink'
                          : 'text-mist'
                    }
                  `}
                >
                  {step}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className="
                    w-12 sm:w-20 md:w-28 lg:w-36
                    h-0.5 mx-2 sm:mx-3
                    rounded-full
                    mb-6 sm:mb-7
                    bg-cream
                    overflow-hidden
                  "
                >
                  <div
                    className={`
                      h-full rounded-full
                      bg-gradient-to-r from-sage to-sage/70
                      transition-all duration-700 ease-out
                      ${isCompleted ? 'w-full' : 'w-0'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}