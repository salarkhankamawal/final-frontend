import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as customersApi from "../../api/customers.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { Input } from "../../Components/ui/Input";
import { Button } from "../../Components/ui/Button";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { formatDate, formatCurrency } from "../../utils/format";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.coerce.number().min(1).max(120),
  passportNumber: z.string().min(1),
  phone: z.string().min(7),
});

export default function CustomerDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("profile");

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.getCustomer(id),
  });

  const { data: history } = useQuery({
    queryKey: ["customer-tickets", id],
    queryFn: () => customersApi.getCustomerTickets(id),
    enabled: tab === "history",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || "",
        email: customer.email || "",
        age: customer.age || 30,
        passportNumber: customer.passportNumber || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload) => customersApi.updateCustomer(id, payload),
    onSuccess: () => {
      toast.success("Customer updated");
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
    },
    onError: (err) => setError("root", { message: getApiErrorMessage(err) }),
  });

  const bookings = history?.bookings ?? history ?? [];
  const tickets = history?.tickets ?? [];

  return (
    <>
      <MetaTags title={customer?.name || "Customer"} />
      <Link to="/admin/customers" className="text-sm text-sky-600 hover:text-sky-700">
        ← Back to customers
      </Link>

      {isLoading && <div className="mt-6"><CardSkeleton /></div>}
      {error && <ApiErrorAlert message={getApiErrorMessage(error)} className="mt-6" />}

      {customer && (
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
          <p className="text-slate-500 mt-1">{customer.phone}</p>

          <div className="flex gap-2 mt-6 border-b border-slate-200">
            {["profile", "history"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  tab === t ? "border-sky-600 text-sky-600" : "border-transparent text-slate-500"
                }`}
              >
                {t === "profile" ? "Profile" : "Bookings & Tickets"}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <form
              onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
              className="mt-6 rounded-xl border border-slate-200 bg-white p-6 max-w-lg space-y-4"
            >
              <ApiErrorAlert message={errors.root?.message} />
              <Input label="Name" error={errors.name?.message} {...register("name")} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
              <Input label="Age" type="number" error={errors.age?.message} {...register("age")} />
              <Input label="Passport" error={errors.passportNumber?.message} {...register("passportNumber")} />
              <Button type="submit" variant="primary" loading={isSubmitting || updateMutation.isPending}>
                Save changes
              </Button>
            </form>
          )}

          {tab === "history" && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-sm text-slate-500">No bookings</p>
                ) : (
                  <ul className="space-y-2">
                    {bookings.map((b) => (
                      <li key={b._id || b.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <Link to={`/admin/bookings/${b._id || b.id}`} className="text-sky-600 font-medium">
                          {b.bookingReference || b.reference}
                        </Link>
                        <StatusBadge status={b.status} />
                        <span className="text-slate-500">{formatDate(b.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Tickets</h2>
                {tickets.length === 0 ? (
                  <p className="text-sm text-slate-500">No tickets</p>
                ) : (
                  <ul className="space-y-2">
                    {tickets.map((t) => (
                      <li key={t._id || t.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <Link to={`/admin/tickets/${t._id || t.id}`} className="text-sky-600 font-medium">
                          {t.ticketNumber}
                        </Link>
                        <span>{formatCurrency(t.amount, t.currency)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
