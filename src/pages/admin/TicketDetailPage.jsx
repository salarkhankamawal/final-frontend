import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ticketsApi from "../../api/tickets.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { SegmentTimeline } from "../../Components/shared/FlightCard";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { Button } from "../../Components/ui/Button";
import { formatDate, formatDateTime } from "../../utils/format";
import { Printer } from "lucide-react";

export default function TicketDetailPage() {
  const { id } = useParams();

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketsApi.getTicket(id),
  });

  return (
    <>
      <MetaTags title={`Ticket ${ticket?.ticketNumber || ""}`} />
      {ticket?.bookingId && (
        <Link
          to={`/admin/bookings/${ticket.bookingId}`}
          className="text-sm text-sky-600 hover:text-sky-700"
        >
          ← Back to booking
        </Link>
      )}

      {isLoading && <div className="mt-6"><CardSkeleton rows={5} /></div>}
      {error && <ApiErrorAlert message={getApiErrorMessage(error)} className="mt-6" />}

      {ticket && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ticket {ticket.ticketNumber}</h1>
              <p className="text-slate-500 mt-1">Issued {formatDateTime(ticket.issuedAt || ticket.createdAt)}</p>
            </div>
            <Link to={`/admin/tickets/${id}/print`}>
              <Button variant="primary">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Passenger</p>
              <p className="font-medium">{ticket.passengerName || ticket.passenger?.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Seat</p>
              <p className="font-medium">{ticket.seat || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Booking reference</p>
              <p className="font-medium">{ticket.bookingReference}</p>
            </div>
            <div>
              <p className="text-slate-500">Departure</p>
              <p className="font-medium">{formatDate(ticket.departureDate)}</p>
            </div>
          </div>

          {ticket.segments?.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold mb-4">Itinerary</h2>
              <SegmentTimeline segments={ticket.segments} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
