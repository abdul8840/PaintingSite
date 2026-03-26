export default function DataTable({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'No data found' 
}) {
  if (loading) {
    return (
      <div className="w-full bg-bg-primary rounded-xl border border-border-light overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="h-14 rounded-lg animate-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="
        w-full 
        bg-bg-primary 
        rounded-xl 
        border border-border-light 
        p-8 sm:p-12 lg:p-16
        text-center
      ">
        <div className="
          w-16 h-16 
          mx-auto mb-4 
          bg-bg-tertiary 
          rounded-full 
          flex items-center justify-center
        ">
          <svg 
            className="w-8 h-8 text-text-muted" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
        </div>
        <p className="text-text-secondary font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="
      w-full 
      bg-bg-primary 
      rounded-xl 
      border border-border-light 
      overflow-hidden
      shadow-sm
    ">
      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-bg-tertiary border-b border-border-light">
              {columns.map((col, i) => (
                <th 
                  key={i}
                  className="
                    px-4 sm:px-6 py-3 sm:py-4
                    text-left
                    text-xs sm:text-sm
                    font-semibold
                    text-text-primary
                    uppercase
                    tracking-wider
                    whitespace-nowrap
                  "
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {data.map((row, rowIdx) => (
              <tr 
                key={row._id || rowIdx}
                className="
                  hover:bg-bg-secondary
                  transition-colors duration-150
                "
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx}
                    className="
                      px-4 sm:px-6 py-3 sm:py-4
                      text-sm
                      text-text-secondary
                      whitespace-nowrap
                    "
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}