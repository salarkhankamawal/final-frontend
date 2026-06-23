import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as flightsApi from "../../api/flights.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { FlightSearchForm } from "../../Components/shared/FlightSearchForm";
import { FlightCard } from "../../Components/shared/FlightCard";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { EmptyState } from "../../Components/shared/EmptyState";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { OfferExpiryBanner } from "../../Components/shared/OfferExpiryBanner";
import { Button } from "../../Components/ui/Button";
import { Link } from "react-router-dom";

export default function FlightSearchPage() {
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
    queryKey: ["flights", queryParams],
    queryFn: () => flightsApi.searchFlights(queryParams),
    enabled: searched && Boolean(queryParams.departureDate),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["flight-suggestions", queryParams],
    queryFn: () =>
      flightsApi.getFlightSuggestions({
        originAirportCode: queryParams.originAirportCode,
        destinationAirportCode: queryParams.destinationAirportCode,
        departureDate: queryParams.departureDate,
      }),
    enabled: searched && !isLoading && !isFetching && Array.isArray(data) && data.length === 0,
  });

  const handleSearch = (form) => {
    const params = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v != null && v !== "")
    );
    setSearchParams(params);
  };

  const offers = Array.isArray(data) ? data : data?.offers ?? [];

  return (
    <>
      <MetaTags title="Search Flights" description="Compare flight prices and schedules." />
      <div className="mx-auto max-w-6xl px-4 py-8">
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
                <CardSkeleton />
              </div>
            )}

            {error && <ApiErrorAlert message={getApiErrorMessage(error)} className="mb-6" />}

            {!isLoading && !error && offers.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">{offers.length} flights found</p>
                {offers.map((offer) => (
                  <FlightCard
                    key={offer.id}
                    offer={offer}
                    onSelect={() => navigate(`/flights/${offer.id}`)}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && offers.length === 0 && (
              <div>
                <EmptyState
                  title="No flights found"
                  description="Try different dates or routes."
                />
                {suggestions?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Suggested alternatives</h3>
                    <div className="space-y-4">
                      {suggestions.map((offer) => (
                        <FlightCard
                          key={offer.id}
                          offer={offer}
                          onSelect={() => navigate(`/flights/${offer.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 rounded-xl bg-sky-50 border border-sky-100 p-6 text-center">
              <p className="text-sm text-slate-700">
                Ready to book? Contact our agency or sign in as an agent.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Agent Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
