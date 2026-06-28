import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, format } from "date-fns";
import { IATA_AIRPORTS } from "../../utils/constants";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

const schema = z.object({
  originAirportCode: z.string().length(3, "Enter a 3-letter IATA code"),
  destinationAirportCode: z.string().length(3, "Enter a 3-letter IATA code"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  adults: z.coerce.number().min(1).max(9),
  sort: z.string().optional(),
}).refine(
  (data) => data.originAirportCode !== data.destinationAirportCode,
  { message: "Origin and destination must differ", path: ["destinationAirportCode"] }
);

const defaultDeparture = format(addDays(new Date(), 7), "yyyy-MM-dd");

export function FlightSearchForm({ defaultValues = {}, onSearch, loading = false, showSort = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      originAirportCode: "KBL",
      destinationAirportCode: "DXB",
      departureDate: defaultDeparture,
      returnDate: "",
      adults: 1,
      sort: "price_asc",
      ...defaultValues,
    },
  });

  const airportOptions = IATA_AIRPORTS.map((a) => ({
    value: a.code,
    label: `${a.code} — ${a.city}`,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="From"
          options={airportOptions}
          error={errors.originAirportCode?.message}
          {...register("originAirportCode")}
        />
        <Select
          label="To"
          options={airportOptions}
          error={errors.destinationAirportCode?.message}
          {...register("destinationAirportCode")}
        />
        <Input
          label="Departure"
          type="date"
          error={errors.departureDate?.message}
          {...register("departureDate")}
        />
        <Input label="Return (optional)" type="date" {...register("returnDate")} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Adults"
          type="number"
          min={1}
          max={9}
          error={errors.adults?.message}
          {...register("adults")}
        />
        {showSort && (
          <Select
            label="Sort by"
            options={[
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "duration_asc", label: "Duration: Shortest" },
              { value: "departure_asc", label: "Departure: Earliest" },
            ]}
            {...register("sort")}
          />
        )}
      </div>
      <Button type="submit" variant="primary" className="mt-6 w-full sm:w-auto cursor-pointer" loading={loading}>
        Search Flights
      </Button>
    </form>
  );
}
