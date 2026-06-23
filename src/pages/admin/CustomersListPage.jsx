import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as customersApi from "../../api/customers.api";
import { MetaTags } from "../../Components/shared/MetaTags";
import { TableSkeleton } from "../../Components/shared/PageSkeleton";
import { EmptyState } from "../../Components/shared/EmptyState";
import { formatDate } from "../../utils/format";

export default function CustomersListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.listCustomers(),
  });

  const customers = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  return (
    <>
      <MetaTags title="Customers" />
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Customers</h1>

      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : customers.length === 0 ? (
        <EmptyState title="No customers" description="Customers are created when bookings are made." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Passport</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/customers/${c._id || c.id}`}
                        className="font-medium text-sky-600 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3">{c.email || "—"}</td>
                    <td className="px-4 py-3">{c.passportNumber || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(c.updatedAt)}</td>
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
