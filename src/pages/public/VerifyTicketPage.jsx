import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as ticketsApi from "../../api/tickets.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { SegmentTimeline } from "../../Components/shared/FlightCard";
import { formatDate, formatCurrency } from "../../utils/format";
import { Ticket } from "lucide-react";

const schema = z
  .object({
    bookingReference: z.string().min(1, "Booking reference is required"),
    phone: z.string().optional(),
    passportNumber: z.string().optional(),
  })
  .refine((d) => d.phone || d.passportNumber, {
    message: "Enter phone number or passport number",
    path: ["phone"],
  });

export default function VerifyTicketPage() {
  const [submitted, setSubmitted] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["verify-ticket", submitted],
    queryFn: () => ticketsApi.verifyTicket(submitted),
    enabled: Boolean(submitted),
    retry: false,
  });

  const onSubmit = (form) => {
    const params = {
      bookingReference: form.bookingReference,
      ...(form.phone ? { phone: form.phone } : {}),
      ...(form.passportNumber ? { passportNumber: form.passportNumber } : {}),
    };
    setSubmitted(params);
    setTimeout(() => refetch(), 0);
  };

  const booking = data?.booking ?? data;
  const ticket = data?.ticket ?? booking?.ticket;
  const isPending = booking?.status === "Pending" && !ticket;

  return (
    <>
      <MetaTags title="Verify Ticket" description="Verify your flight ticket with booking reference." />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-7 h-7 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Ticket</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your booking reference and phone or passport number
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <Input
            label="Booking reference"
            placeholder="BK..."
            error={errors.bookingReference?.message}
            {...register("bookingReference")}
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="0700123456"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <p className="text-xs text-slate-500 text-center">— or —</p>
          <Input
            label="Passport number"
            error={errors.passportNumber?.message}
            {...register("passportNumber")}
          />
          <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
            Verify
          </Button>
        </form>

        {error && submitted && (
          <ApiErrorAlert message={getApiErrorMessage(error)} className="mt-6" />
        )}

        {booking && !error && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Booking {booking.bookingReference || booking.reference}</h2>
              <StatusBadge status={booking.status || booking.bookingStatus} />
            </div>

            {isPending && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                Your booking is pending confirmation. Please contact the agency to complete your reservation.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Passenger</p>
                <p className="font-medium">{booking.passenger?.name || booking.customer?.name || ticket?.passengerName || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="font-medium">{booking.phone || booking.customer?.phone || ticket?.phone || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500">Passport</p>
                <p className="font-medium">{booking.passenger?.passportNumber || booking.customer?.passportNumber || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500">Booking created</p>
                <p className="font-medium">{formatDate(booking.createdAt || booking.created)}</p>
              </div>

              <div>
                <p className="text-slate-500">Flight</p>
                <p className="font-medium">{booking.flightName || booking.flight?.flightNumber || booking.flightSnapshot?.flightNumber || "—"}</p>
              </div>
              <div>
                <p className="text-slate-500">Route</p>
                <p className="font-medium">{booking.flightDetails || booking.route || booking.flightSnapshot ? `${booking.flightSnapshot?.originAirportCode || booking.flight?.originAirportCode || ""} → ${booking.flightSnapshot?.destinationAirportCode || booking.flight?.destinationAirportCode || ""}` : "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Departure</p>
                <p className="font-medium">
                  {(booking.flight?.departureDate || booking.flightSnapshot?.departureDate)
                    ? `${booking.flight?.originCity || booking.flightSnapshot?.originCity || booking.flight?.originAirportCode || booking.flightSnapshot?.originAirportCode || "Departure"}${booking.flight?.originCountry || booking.flightSnapshot?.originCountry ? `, ${booking.flight?.originCountry || booking.flightSnapshot?.originCountry}` : ""} · ${formatDate(booking.flight?.departureDate || booking.flightSnapshot?.departureDate)}${booking.flight?.departureTime || booking.flightSnapshot?.departureTime ? ` · ${booking.flight?.departureTime || booking.flightSnapshot?.departureTime}` : ""}`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Arrival</p>
                <p className="font-medium">
                  {(booking.flight?.arrivalDate || booking.flightSnapshot?.arrivalDate)
                    ? `${booking.flight?.destinationCity || booking.flightSnapshot?.destinationCity || booking.flight?.destinationAirportCode || booking.flightSnapshot?.destinationAirportCode || "Arrival"}${booking.flight?.destinationCountry || booking.flightSnapshot?.destinationCountry ? `, ${booking.flight?.destinationCountry || booking.flightSnapshot?.destinationCountry}` : ""} · ${formatDate(booking.flight?.arrivalDate || booking.flightSnapshot?.arrivalDate)}${booking.flight?.arrivalTime || booking.flightSnapshot?.arrivalTime ? ` · ${booking.flight?.arrivalTime || booking.flightSnapshot?.arrivalTime}` : ""}`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Amount</p>
                <p className="font-medium">{formatCurrency(booking.amount ?? booking.grandTotal ?? booking.totalFare ?? booking.paymentInfo?.amount ?? 0, booking.currency)}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-medium">{booking.status || booking.bookingStatus || "—"}</p>
              </div>

              {ticket && (
                <>
                  <div>
                    <p className="text-slate-500">Ticket number</p>
                    <p className="font-medium">{ticket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Seat</p>
                    <p className="font-medium">{ticket.seat || ticket.seatNumber || "—"}</p>
                  </div>
                </>
              )}
            </div>

            {(ticket?.segments || booking.flight?.segments || booking.segments) && (
              <div>
                <SegmentTimeline segments={ticket?.segments || booking.flight?.segments || booking.segments} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
