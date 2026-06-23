import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Plane, CalendarCheck } from "lucide-react";
import * as bookingsApi from "../../api/bookings.api";
import { useAuth } from "../../hooks/useAuth";
import { MetaTags } from "../../Components/shared/MetaTags";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { TableSkeleton } from "../../Components/shared/PageSkeleton";
import { Button } from "../../Components/ui/Button";
import { formatDate, formatCurrency } from "../../utils/format";

export default function AdminDashboardPage() {
  const { agent } = useAuth();
  const agentName = agent ? `${agent.firstName || ""} ${agent.lastName || ""}`.trim() : "Agent";

  const { data: pendingResult, isLoading: pendingLoading } = useQuery({
    queryKey: ["bookings", { status: "Pending" }],
    queryFn: () => bookingsApi.listBookings({ status: "Pending" }),
  });

  const { data: recentResult, isLoading: recentLoading } = useQuery({
    queryKey: ["bookings", { limit: 10 }],
    queryFn: () => bookingsApi.listBookings({}),
  });

  const pendingCount = pendingResult?.count ?? pendingResult?.data?.length ?? 0;
  const recent = Array.isArray(recentResult?.data) ? recentResult.data.slice(0, 8) : [];

  return (
    <>
      <MetaTags title="Dashboard" />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {agentName}</h1>
        {agent?.agencyName && (
          <p className="text-slate-500 mt-1">{agent.agencyName}</p>
        )}

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Pending bookings</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">
              {pendingLoading ? "—" : pendingCount}
            </p>
            <Link to="/admin/bookings?status=Pending" className="text-sm text-sky-600 mt-2 inline-block">
              View all →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/admin/bookings/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              New Booking
            </Button>
          </Link>
          <Link to="/admin/flights">
            <Button variant="outline">
              <Plane className="w-4 h-4" />
              Search Flights
            </Button>
          </Link>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Recent bookings
            </h2>
            <Link to="/admin/bookings" className="text-sm text-sky-600">
              View all
            </Link>
          </div>

          {recentLoading ? (
            <TableSkeleton />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Reference</th>
                      <th className="text-left px-4 py-3 font-medium">Passenger</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((b) => (
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
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(b.totalAmount ?? b.paymentInfo?.amount, b.currency)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(b.createdAt)}
                        </td>
                      </tr>
                    ))}
                    {recent.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No bookings yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
