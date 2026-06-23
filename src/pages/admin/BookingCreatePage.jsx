import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as bookingsApi from "../../api/bookings.api";
import * as customersApi from "../../api/customers.api";
import * as flightsApi from "../../api/flights.api";
import { getApiErrorMessage } from "../../api/client";
import { PAYMENT_METHODS } from "../../utils/constants";
import { MetaTags } from "../../Components/shared/MetaTags";
import { Input } from "../../Components/ui/Input";
import { Select } from "../../Components/ui/Select";
import { Textarea } from "../../Components/ui/Textarea";
import { Button } from "../../Components/ui/Button";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { FlightCard } from "../../Components/shared/FlightCard";
import { OfferExpiryBanner } from "../../Components/shared/OfferExpiryBanner";
import { formatCurrency } from "../../utils/format";

const schema = z.object({
  phone: z.string().min(7, "Phone is required"),
  passengerName: z.string().min(1, "Passenger name is required"),
  passengerAge: z.coerce.number().min(1).max(120),
  passengerEmail: z.string().email("Valid email required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  paymentMethod: z.enum(["Cash", "Card", "Bank Transfer", "Other"]),
  paymentAmount: z.coerce.number().min(0),
  paymentNotes: z.string().optional(),
  discount: z.coerce.number().min(0).optional(),
});

export default function BookingCreatePage() {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("offerId");
  const navigate = useNavigate();

  const { data: offer, isLoading: offerLoading } = useQuery({
    queryKey: ["admin-offer", offerId],
    queryFn: () => flightsApi.adminGetFlightOffer(offerId),
    enabled: Boolean(offerId),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "Cash",
      paymentAmount: 0,
      discount: 0,
      paymentNotes: "",
    },
  });

  const phone = watch("phone");

  useEffect(() => {
    if (offer) {
      const price = offer.price?.total ?? offer.totalPrice ?? offer.price ?? 0;
      setValue("paymentAmount", Number(price) || 0);
    }
  }, [offer, setValue]);

  const lookupCustomer = async () => {
    if (!phone || phone.length < 7) return;
    try {
      const customer = await customersApi.getCustomerByPhone(phone);
      if (customer) {
        setValue("passengerName", customer.name || "");
        setValue("passengerAge", customer.age || 30);
        setValue("passengerEmail", customer.email || "");
        setValue("passportNumber", customer.passportNumber || "");
        toast.success("Customer found — details auto-filled");
      }
    } catch {
      // customer not found is fine
    }
  };

  const createMutation = useMutation({
    mutationFn: bookingsApi.createBooking,
    onSuccess: (booking) => {
      toast.success("Booking created");
      navigate(`/admin/bookings/${booking._id || booking.id}`);
    },
    onError: (err) => setError("root", { message: getApiErrorMessage(err) }),
  });

  const onSubmit = (form) => {
    if (!offerId) {
      setError("root", { message: "Select a flight first from flight search." });
      return;
    }
    createMutation.mutate({
      offerId,
      phone: form.phone,
      passenger: {
        name: form.passengerName,
        age: form.passengerAge,
        email: form.passengerEmail,
        passportNumber: form.passportNumber,
      },
      paymentInfo: {
        method: form.paymentMethod,
        amount: form.paymentAmount,
        notes: form.paymentNotes || "",
      },
      discount: form.discount || 0,
    });
  };

  const price = offer?.price?.total ?? offer?.totalPrice ?? offer?.price;

  return (
    <>
      <MetaTags title="New Booking" />
      <Link to="/admin/flights" className="text-sm text-sky-600 hover:text-sky-700">
        ← Search flights
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-6">Create Booking</h1>

      {!offerId && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 mb-6">
          No flight selected.{" "}
          <Link to="/admin/flights" className="font-medium underline">
            Search and select a flight
          </Link>
        </div>
      )}

      {offerId && offerLoading && <CardSkeleton />}
      {offer && (
        <div className="mb-6 space-y-4">
          <OfferExpiryBanner startedAt={Date.now()} />
          <FlightCard offer={offer} showSelect={false} />
          <p className="text-sm text-slate-500">
            Offer price: {formatCurrency(price, offer.price?.currency ?? offer.currency)}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-slate-200 bg-white p-6 space-y-6 max-w-2xl"
      >
        <ApiErrorAlert message={errors.root?.message} />

        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Customer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
              onBlur={lookupCustomer}
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Passenger</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" error={errors.passengerName?.message} {...register("passengerName")} />
            <Input label="Age" type="number" error={errors.passengerAge?.message} {...register("passengerAge")} />
            <Input label="Email" type="email" error={errors.passengerEmail?.message} {...register("passengerEmail")} />
            <Input label="Passport" error={errors.passportNumber?.message} {...register("passportNumber")} />
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Payment</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Method"
              options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
              error={errors.paymentMethod?.message}
              {...register("paymentMethod")}
            />
            <Input label="Amount" type="number" step="0.01" error={errors.paymentAmount?.message} {...register("paymentAmount")} />
            <Input label="Discount" type="number" step="0.01" {...register("discount")} />
          </div>
          <Textarea label="Notes" className="mt-4" {...register("paymentNotes")} />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting || createMutation.isPending}
          disabled={!offerId}
        >
          Create booking
        </Button>
      </form>
    </>
  );
}
