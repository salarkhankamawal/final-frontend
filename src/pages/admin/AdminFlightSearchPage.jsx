import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as flightsApi from "../../api/flights.api";
import { extractFlightOffers } from "../../utils/flights";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { FlightSearchForm } from "../../Components/shared/FlightSearchForm";
import { FlightCard } from "../../Components/shared/FlightCard";
import { OfferExpiryBanner } from "../../Components/shared/OfferExpiryBanner";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { EmptyState } from "../../Components/shared/EmptyState";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";

export default function AdminFlightSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searched = searchParams.has("originAirportCode");

  const queryParams = useMemo(
    () => ({
      originAirportCode: searchParams.get("originAirportCode") || "KBL",
      destinationAirportCode: searchParams.get("destinationAirportCode") || "DXB",
      departureDate: searchParams.get("departureDate") || "",
      returnDate: searchParams.get("returnDate") || "",
      adults: searchParams.get("adults") || "1",
      sort: searchParams.get("sort") || "price_asc",
    }),
    [searchParams]
  );

  const searchStartedAt = useMemo(() => Date.now(), [searchParams.toString()]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["admin-flights", queryParams],
    queryFn: () => flightsApi.adminSearchFlights(queryParams),
    enabled: searched && Boolean(queryParams.departureDate),
  });

  const handleSearch = (form) => {
    setSearchParams(
      Object.fromEntries(Object.entries(form).filter(([, v]) => v != null && v !== ""))
    );
  };

  const offers = extractFlightOffers(data);

  return (
    <>
      <MetaTags title="Search Flights" />
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Search Flights</h1>
      <FlightSearchForm
        defaultValues={queryParams}
        onSearch={handleSearch}
        loading={isFetching}
        showSort
      />

      {searched && (
        <div className="mt-8">
          <OfferExpiryBanner startedAt={searchStartedAt} className="mb-6" />
          {isLoading && (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}
          {error && <ApiErrorAlert message={getApiErrorMessage(error)} />}
          {!isLoading && !error && offers.length > 0 && (
            <div className="space-y-4">
              {offers.map((offer) => (
                <FlightCard
                  key={offer.id}
                  offer={offer}
                  selectLabel="Select flight"
                  onSelect={() =>
                    navigate(`/admin/bookings/new?offerId=${encodeURIComponent(offer.id)}`)
                  }
                />
              ))}
            </div>
          )}
          {!isLoading && !error && offers.length === 0 && (
            <EmptyState title="No flights found" description="Try different search criteria." />
          )}
        </div>
      )}
    </>
  );
}
