import { Clock, AlertTriangle } from "lucide-react";
import { useOfferTimer } from "../../hooks/useOfferTimer";

export function OfferExpiryBanner({ startedAt, className = "" }) {
  const { expired, label } = useOfferTimer(startedAt);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
        expired
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-amber-50 border border-amber-200 text-amber-900"
      } ${className}`}
    >
      {expired ? (
        <AlertTriangle className="w-4 h-4 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 shrink-0" />
      )}
      {expired ? (
        <span>This offer has expired. Please search again for current prices.</span>
      ) : (
        <span>
          Flight prices are locked for <strong>{label}</strong>. Book soon before this offer expires.
        </span>
      )}
    </div>
  );
}
