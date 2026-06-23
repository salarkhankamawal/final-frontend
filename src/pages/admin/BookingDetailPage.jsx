import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as bookingsApi from "../../api/bookings.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { SegmentTimeline } from "../../Components/shared/FlightCard";
import { ConfirmModal } from "../../Components/shared/ConfirmModal";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { Button } from "../../Components/ui/Button";
import { Textarea } from "../../Components/ui/Textarea";
import { Input } from "../../Components/ui/Input";
import { formatDate, formatCurrency, formatDateTime } from "../../utils/format";
import { CheckCircle, XCircle, RefreshCw, Printer } from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [newOfferId, setNewOfferId] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getBooking(id),
  });

  const confirmMutation = useMutation({
    mutationFn: () => bookingsApi.confirmBooking(id),
    onSuccess: (result) => {
      setConfirmResult(result);
      toast.success("Booking confirmed — ticket issued");
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancelBooking(id, { cancelReason }),
    onSuccess: () => {
      toast.success("Booking cancelled");
      setCancelOpen(false);
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const rescheduleMutation = useMutation({
    mutationFn: () => bookingsApi.rescheduleBooking(id, { newOfferId }),
    onSuccess: () => {
      toast.success("Booking rescheduled — status is Pending");
      setRescheduleOpen(false);
      setNewOfferId("");
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const isPending = booking?.status === "Pending";
  const isConfirmed = booking?.status === "Confirmed";
  const isCancelled = booking?.status === "Cancelled";
  const ticket = booking?.ticket ?? confirmResult?.ticket;
  const ticketId = ticket?._id || ticket?.id;

  return (
    <>
      <MetaTags title={`Booking ${booking?.bookingReference || ""}`} />
      <Link to="/admin/bookings" className="text-sm text-sky-600 hover:text-sky-700">
        ← Back to bookings
      </Link>

      {isLoading && <div className="mt-6"><CardSkeleton rows={6} /></div>}
      {error && <ApiErrorAlert message={getApiErrorMessage(error)} className="mt-6" />}

      {booking && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {booking.bookingReference || booking.reference}
              </h1>
              <p className="text-slate-500 mt-1">Created {formatDateTime(booking.createdAt)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              disabled={!isPending || confirmMutation.isPending}
              loading={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              <CheckCircle className="w-4 h-4" />
              Confirm booking
            </Button>
            <Button
              variant="danger"
              disabled={isCancelled || cancelMutation.isPending}
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={!isConfirmed || rescheduleMutation.isPending}
              onClick={() => setRescheduleOpen(true)}
            >
              <RefreshCw className="w-4 h-4" />
              Reschedule
            </Button>
            {ticketId && (
              <Link to={`/admin/tickets/${ticketId}/print`}>
                <Button variant="outline">
                  <Printer className="w-4 h-4" />
                  Print ticket
                </Button>
              </Link>
            )}
          </div>

          {(confirmResult || ticket) && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm">
              <p className="font-medium text-emerald-900">Ticket issued</p>
              <p className="mt-1 text-emerald-800">
                Ticket #: {(confirmResult?.ticket || ticket)?.ticketNumber}
                {(confirmResult?.ticket || ticket)?.seat && ` · Seat ${(confirmResult?.ticket || ticket).seat}`}
              </p>
              {confirmResult?.emailSent != null && (
                <p className="mt-1 text-emerald-700">
                  Email {confirmResult.emailSent ? "sent" : "not sent"} to passenger
                </p>
              )}
              {ticketId && (
                <Link to={`/admin/tickets/${ticketId}`} className="text-sky-600 underline mt-2 inline-block">
                  View ticket details
                </Link>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Passenger</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Name</dt>
                  <dd>{booking.passenger?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Email</dt>
                  <dd>{booking.passenger?.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phone</dt>
                  <dd>{booking.phone}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Passport</dt>
                  <dd>{booking.passenger?.passportNumber}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Payment</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Method</dt>
                  <dd>{booking.paymentInfo?.method}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Amount</dt>
                  <dd>{formatCurrency(booking.paymentInfo?.amount, booking.currency)}</dd>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Discount</dt>
                    <dd>{formatCurrency(booking.discount, booking.currency)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {(booking.flight?.segments || booking.segments) && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Flight</h2>
              <SegmentTimeline segments={booking.flight?.segments || booking.segments} />
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={cancelOpen}
        title="Cancel booking"
        message="This will cancel the booking. This action cannot be undone."
        confirmLabel="Cancel booking"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
        onCancel={() => setCancelOpen(false)}
      />

      {cancelOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md rounded-xl bg-white p-4 shadow-lg border -mt-32">
            <Textarea
              label="Cancel reason (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
        </div>
      )}

      {rescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setRescheduleOpen(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Reschedule booking</h2>
            <p className="text-sm text-slate-600 mt-1">
              Enter a new offer ID from flight search. Status will return to Pending.
            </p>
            <Input
              label="New offer ID"
              className="mt-4"
              value={newOfferId}
              onChange={(e) => setNewOfferId(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={rescheduleMutation.isPending}
                disabled={!newOfferId}
                onClick={() => rescheduleMutation.mutate()}
              >
                Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
