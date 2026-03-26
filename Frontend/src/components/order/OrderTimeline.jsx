import { HiCheck } from 'react-icons/hi';

export default function OrderTimeline({ statusHistory = [] }) {
  if (statusHistory.length === 0) return null;

  return (
    <div
      className="
        bg-paper rounded-2xl
        border border-cream
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-cream bg-cream/30">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
          Order Timeline
        </h3>
      </div>

      {/* Timeline */}
      <div className="px-5 py-5">
        <div className="relative">
          {statusHistory.map((entry, index) => {
            const isFirst = index === 0;
            const isLast = index === statusHistory.length - 1;

            return (
              <div
                key={index}
                className={`
                  relative flex gap-4
                  ${!isLast ? 'pb-6' : ''}
                  animate-fade-in-up opacity-0
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Line + Dot */}
                <div className="relative flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`
                      relative z-10
                      w-8 h-8 rounded-xl
                      flex items-center justify-center
                      shrink-0
                      transition-all duration-300
                      ${
                        isFirst
                          ? 'bg-rust text-paper shadow-md shadow-rust/20'
                          : 'bg-sage/15 text-sage'
                      }
                    `}
                  >
                    <HiCheck className="w-4 h-4" />
                  </div>

                  {/* Vertical Line */}
                  {!isLast && (
                    <div
                      className="
                        w-0.5 flex-1
                        bg-gradient-to-b from-sage/30 to-cream
                        mt-1
                      "
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 pt-1">
                  <p
                    className={`
                      text-sm font-semibold capitalize
                      ${isFirst ? 'text-ink' : 'text-charcoal'}
                    `}
                  >
                    {entry.status}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-mist mt-0.5 leading-relaxed">
                      {entry.note}
                    </p>
                  )}
                  <p className="text-[10px] text-mist/60 mt-1 font-medium">
                    {new Date(entry.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}