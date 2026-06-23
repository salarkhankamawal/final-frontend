import { AlertCircle } from "lucide-react";

export function ApiErrorAlert({ message, className = "" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 ${className}`}
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
