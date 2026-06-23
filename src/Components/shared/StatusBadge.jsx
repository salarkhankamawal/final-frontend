import { BOOKING_STATUS_COLORS } from "../../utils/constants";

export function StatusBadge({ status, className = "" }) {
  const colors = BOOKING_STATUS_COLORS[status] || "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colors} ${className}`}
    >
      {status}
    </span>
  );
}
