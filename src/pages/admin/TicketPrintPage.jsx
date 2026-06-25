import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ticketsApi from "../../api/tickets.api";
import { getApiErrorMessage } from "../../api/client";
import { SegmentTimeline } from "../../Components/shared/FlightCard";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { formatDate, formatTime } from "../../utils/format";

export default function TicketPrintPage() {
  const { id } = useParams();

  const { data: ticket, isLoading, error, isSuccess } = useQuery({
    queryKey: ["ticket-print", id],
    queryFn: () => ticketsApi.getTicketPrint(id),
  });

  useEffect(() => {
    if (isSuccess && ticket) {
      const timer = setTimeout(() => window.print(), 500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, ticket]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center print:hidden">
        <p className="text-slate-500">Loading ticket…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 print:hidden">
        <ApiErrorAlert message={getApiErrorMessage(error)} />
      </div>
    );
  }

  const segments = ticket?.segments || [];

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #boarding-pass, #boarding-pass * { visibility: visible; }
          #boarding-pass { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div className="print:hidden p-4 bg-slate-100 text-center text-sm text-slate-600">
        Print dialog will open automatically.{" "}
        <button type="button" onClick={() => window.print()} className="text-sky-600 underline">
          Print again
        </button>
      </div>

      <div id="boarding-pass" className="max-w-2xl mx-auto p-8 bg-white">
        <div className="border-2 border-slate-900 rounded-lg overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-70">Boarding Pass</p>
              <p className="text-xl font-bold">{ticket.airline || "SkyRoute Travel"}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">{ticket.ticketNumber}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase">Passenger</p>
              <p className="text-lg font-semibold">{ticket.passengerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Seat</p>
              <p className="text-lg font-semibold">{ticket.seat || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Booking Ref</p>
              <p className="font-mono font-semibold">{ticket.bookingReference}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Date</p>
              <p className="font-semibold">{formatDate(ticket.departureDate)}</p>
            </div>
          </div>

          {segments.length > 0 && (
            <div className="px-6 pb-6 border-t border-slate-200 pt-4">
              {segments.map((seg, i) => (
                <div key={i} className="flex justify-between items-center py-2 text-sm">
                  <div>
                    <span className="font-bold text-lg">{seg.departureAirport}</span>
                    <span className="text-slate-400 mx-2">→</span>
                    <span className="font-bold text-lg">{seg.arrivalAirport}</span>
                  </div>
                  <div className="text-right text-slate-600">
                    <p>{seg.flightNumber}</p>
                    <p>{formatTime(seg.departureTime)} – {formatTime(seg.arrivalTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-slate-50 px-6 py-3 text-xs text-slate-500 text-center border-t">
            Present this boarding pass at check-in · Nawi Saadi Travel Agency
          </div>
        </div>
      </div>
    </>
  );
}
