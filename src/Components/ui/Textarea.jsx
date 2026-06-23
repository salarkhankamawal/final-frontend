export function Textarea({ label, error, className = "", id, rows = 3, ...props }) {
  const textareaId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
          error ? "border-red-400" : "border-slate-200"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
