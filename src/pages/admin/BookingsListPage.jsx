import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import * as bookingsApi from "../../api/bookings.api";
import { BOOKING_STATUSES } from "../../utils/constants";
import { MetaTags } from "../../Components/shared/MetaTags";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { TableSkeleton } from "../../Components/shared/PageSkeleton";
import { EmptyState } from "../../Components/shared/EmptyState";
import { Button } from "../../Components/ui/Button";
import { formatDate, formatCurrency } from "../../utils/format";

export default function BookingsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", { status: statusFilter || undefined }],
    queryFn: () =>
      bookingsApi.listBookings(statusFilter ? { status: statusFilter } : {}),
  });

  const bookings = Array.isArray(data?.data) ? data.data : [];

  const setStatus = (status) => {
    if (status) setSearchParams({ status });
    else setSearchParams({});
  };

  return (
    <>
      <MetaTags title="Bookings" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <Link to="/admin/bookings/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            New Booking
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setStatus("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !statusFilter ? "bg-sky-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          All
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              statusFilter === s ? "bg-sky-600 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings"
          description={statusFilter ? `No ${statusFilter.toLowerCase()} bookings.` : "Create your first booking."}
          actionLabel="New Booking"
          onAction={() => (window.location.href = "/admin/bookings/new")}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Reference</th>
                  <th className="text-left px-4 py-3 font-medium">Passenger</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/bookings/${b._id || b.id}`}
                        className="font-medium text-sky-600 hover:underline"
                      >
                        {b.bookingReference || b.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{b.passenger?.name || "—"}</td>
                    <td className="px-4 py-3">{b.phone || b.customer?.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(b.totalAmount ?? b.paymentInfo?.amount, b.currency)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
