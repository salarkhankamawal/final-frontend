import { formatTime, formatDuration, formatCurrency, formatStops } from "../../utils/format";
import { normalizeFlightOffer } from "../../utils/flights";
import { Button } from "../ui/Button";

export function SegmentTimeline({ segments = [] }) {
  if (!segments.length) return null;

  return (
    <div className="space-y-4">
      {segments.map((seg, i) => {
        const normalized = {
          departureAirport: seg.departureAirport || seg.from,
          arrivalAirport: seg.arrivalAirport || seg.to,
          departureTime: seg.departureTime || seg.departureAt,
          arrivalTime: seg.arrivalTime || seg.arrivalAt,
          airline: seg.airline || seg.airlineName || seg.carrierCode,
          flightNumber: seg.flightNumber,
          duration: seg.duration,
        };
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
              {i < segments.length - 1 && (
                <div className="w-0.5 flex-1 bg-slate-200 my-1 min-h-[24px]" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-slate-900">{normalized.departureAirport}</span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold text-slate-900">{normalized.arrivalAirport}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {normalized.airline}
                {normalized.flightNumber && ` · ${normalized.flightNumber}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatTime(normalized.departureTime)} – {formatTime(normalized.arrivalTime)}
                {normalized.duration != null && ` · ${formatDuration(normalized.duration)}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FlightCard({ offer, onSelect, selectLabel = "View details", showSelect = true }) {
  const flight = normalizeFlightOffer(offer);
  const segments = flight.segments;
  const first = segments[0];
  const last = segments[segments.length - 1];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            {flight.airlineLogo && (
              <img
                src={flight.airlineLogo}
                alt=""
                className="w-6 h-6 object-contain"
              />
            )}
            <span className="text-sm font-medium text-slate-900">{flight.airline}</span>
            {flight.flightNumber && (
              <span className="text-xs text-slate-500">{flight.flightNumber}</span>
            )}
            {flight.seatClass && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {flight.seatClass}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatTime(flight.departureTime || first?.departureTime)}
              </p>
              <p className="text-sm text-slate-500">
                {first?.departureAirport || flight.origin}
              </p>
            </div>
            <div className="flex-1 min-w-[120px] text-center px-2">
              <p className="text-xs text-slate-500">{formatStops(flight.stops)}</p>
              <div className="flex items-center gap-2 my-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">✈</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <p className="text-xs text-slate-500">{formatDuration(flight.duration)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {formatTime(flight.arrivalTime || last?.arrivalTime)}
              </p>
              <p className="text-sm text-slate-500">
                {last?.arrivalAirport || flight.destination}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 lg:border-l lg:border-slate-100 lg:pl-6">
          <p className="text-2xl font-bold text-sky-600">
            {formatCurrency(flight.price, flight.currency)}
          </p>
          {flight.seatsAvailable != null && (
            <p className="text-xs text-slate-500">{flight.seatsAvailable} seats left</p>
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
