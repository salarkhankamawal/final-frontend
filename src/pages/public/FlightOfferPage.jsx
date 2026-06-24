import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import * as flightsApi from "../../api/flights.api";
import { getApiErrorMessage } from "../../api/client";
import { MetaTags } from "../../Components/shared/MetaTags";
import { SegmentTimeline } from "../../Components/shared/FlightCard";
import { OfferExpiryBanner } from "../../Components/shared/OfferExpiryBanner";
import { ApiErrorAlert } from "../../Components/shared/ApiErrorAlert";
import { CardSkeleton } from "../../Components/shared/PageSkeleton";
import { Button } from "../../Components/ui/Button";
import { normalizeFlightOffer } from "../../utils/flights";
import { formatCurrency, formatDuration, formatStops } from "../../utils/format";
import { Phone, LogIn } from "lucide-react";

export default function FlightOfferPage() {
  const { offerId } = useParams();
  const startedAt = useMemo(() => Date.now(), [offerId]);

  const { data: offer, isLoading, error } = useQuery({
    queryKey: ["flight-offer", offerId],
    queryFn: () => flightsApi.getFlightOffer(offerId),
    enabled: Boolean(offerId),
  });

  const flight = offer ? normalizeFlightOffer(offer) : null;

  return (
    <>
      <MetaTags
        title={
          flight
            ? `${flight.origin} to ${flight.destination}`
            : "Flight Details"
        }
        description="View flight offer details and contact our agency to book."
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/flights" className="text-sm text-sky-600 hover:text-sky-700">
          ← Back to search
        </Link>

        {isLoading && <div className="mt-6"><CardSkeleton rows={5} /></div>}
        {error && <ApiErrorAlert message={getApiErrorMessage(error)} className="mt-6" />}

        {flight && (
          <div className="mt-6 space-y-6">
            <OfferExpiryBanner startedAt={startedAt} />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {flight.airline} · {flight.seatClass || "Economy"}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatStops(flight.stops)} · {formatDuration(flight.duration)}
                  </p>
                </div>
                <p className="text-3xl font-bold text-sky-600">
                  {formatCurrency(flight.price, flight.currency)}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                  Itinerary
                </h2>
                <SegmentTimeline segments={flight.segments} />
              </div>

              {flight.seatsAvailable != null && (
                <p className="mt-4 text-sm text-slate-500">
                  {flight.seatsAvailable} seats available
                </p>
              )}
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-6">
              <h2 className="font-semibold text-lg">Want to book this flight?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Public users cannot book directly. Contact our travel agency or sign in as an agent.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="tel:+93700000000">
                  <Button className="bg-white text-slate-900 hover:bg-slate-100">
                    <Phone className="w-4 h-4" />
                    Call Agency
                  </Button>
                </a>
                <Link to="/login">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                    <LogIn className="w-4 h-4" />
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
