import { BOOKING_STATUS_COLORS } from "../../utils/constants";

export function Badge({ children, color, className = "" }) {
  const colors = color || BOOKING_STATUS_COLORS[children] || "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colors} ${className}`}
    >
      {children}
    </span>
  );
}
