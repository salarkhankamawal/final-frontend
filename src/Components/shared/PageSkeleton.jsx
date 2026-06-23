export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="grid gap-4 p-4 border-b border-slate-100" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 p-4 border-b border-slate-50"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3 bg-slate-100 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse mb-8">
      <div className="h-8 bg-slate-200 rounded w-48 mb-2" />
      <div className="h-4 bg-slate-100 rounded w-72" />
    </div>
  );
}
