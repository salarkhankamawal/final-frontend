import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ticketsApi from "../../api/tickets.api";
import { getApiErrorMessage } from "../../api/client";
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

  const flight = ticket?.flight || {};
  const passenger = ticket?.passenger || {};
  const seatNumber = ticket?.seat?.number || ticket?.seatNumber || "—";
  const departureDate = flight?.departureDate || "TBA";
  const departureTime = flight?.departureTime || "TBA";
  const arrivalDate = flight?.arrivalDate || "TBA";
  const arrivalTime = flight?.arrivalTime || "TBA";
  const route = `${flight?.origin || ""}${flight?.origin && flight?.destination ? " → " : ""}${flight?.destination || ""}`;

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
        Print dialog will open automatically. <button type="button" onClick={() => window.print()} className="text-sky-600 underline">
          Print again
        </button>
      </div>

      <div id="boarding-pass" className="max-w-2xl mx-auto p-8 bg-white">
        <div className="border-2 border-slate-900 rounded-lg overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-70">Boarding Pass</p>
              <p className="text-xl font-bold">{flight.airline || "Nawi Saadi"}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">{ticket.ticketNumber}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase">Passenger</p>
              <p className="text-lg font-semibold">{passenger.name || "Passenger"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Seat</p>
              <p className="text-lg font-semibold">{seatNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Booking Ref</p>
              <p className="font-mono font-semibold">{ticket.bookingReference}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Route</p>
              <p className="font-semibold">{route || "TBA"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Departure</p>
              <p className="font-semibold">{formatDate(departureDate)} · {formatTime(departureTime)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Arrival</p>
              <p className="font-semibold">{formatDate(arrivalDate)} · {formatTime(arrivalTime)}</p>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-3 text-xs text-slate-500 text-center border-t">
            Present this boarding pass at check-in · Nawi Saadi Travel Agency
          </div>
        </div>
      </div>
    </>
  );
}
