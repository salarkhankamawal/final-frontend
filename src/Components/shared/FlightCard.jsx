import { formatTime, formatDuration, formatCurrency, formatStops } from "../../utils/format";
import { Button } from "../ui/Button";

export function SegmentTimeline({ segments = [] }) {
  if (!segments.length) return null;

  return (
    <div className="space-y-4">
      {segments.map((seg, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-sky-500" />
            {i < segments.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[24px]" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-slate-900">{seg.departureAirport}</span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold text-slate-900">{seg.arrivalAirport}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {seg.airline || seg.carrier} {seg.flightNumber && `· ${seg.flightNumber}`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatTime(seg.departureTime)} – {formatTime(seg.arrivalTime)}
              {seg.duration != null && ` · ${formatDuration(seg.duration)}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FlightCard({ offer, onSelect, selectLabel = "View details", showSelect = true }) {
  const segments = offer.segments || offer.itineraries?.[0]?.segments || [];
  const first = segments[0];
  const last = segments[segments.length - 1];
  const stops = offer.stops ?? Math.max(0, segments.length - 1);
  const airline = offer.airline || first?.airline || first?.carrier || "Airline";
  const price = offer.price?.total ?? offer.totalPrice ?? offer.price;
  const currency = offer.price?.currency ?? offer.currency ?? "USD";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-900">{airline}</span>
            {offer.seatClass && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {offer.seatClass}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {first ? formatTime(first.departureTime) : "—"}
              </p>
              <p className="text-sm text-slate-500">{first?.departureAirport || offer.origin}</p>
            </div>
            <div className="flex-1 min-w-[120px] text-center px-2">
              <p className="text-xs text-slate-500">{formatStops(stops)}</p>
              <div className="flex items-center gap-2 my-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">✈</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <p className="text-xs text-slate-500">
                {formatDuration(offer.duration ?? offer.totalDuration)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {last ? formatTime(last.arrivalTime) : "—"}
              </p>
              <p className="text-sm text-slate-500">{last?.arrivalAirport || offer.destination}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 lg:border-l lg:border-slate-100 lg:pl-6">
          <p className="text-2xl font-bold text-sky-600">{formatCurrency(price, currency)}</p>
          {offer.seatsAvailable != null && (
            <p className="text-xs text-slate-500">{offer.seatsAvailable} seats left</p>
          )}
          {showSelect && onSelect && (
            <Button variant="primary" size="sm" onClick={() => onSelect(offer)}>
              {selectLabel}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
