/**
 * Maps backend flight offer shape (Amadeus / SearchAPI) to UI-friendly fields.
 */
export function normalizeSegment(seg = {}) {
  return {
    ...seg,
    departureAirport:
      seg.departureAirport || seg.from || seg.originAirportCode || seg.origin,
    arrivalAirport:
      seg.arrivalAirport || seg.to || seg.destinationAirportCode || seg.destination,
    departureTime: seg.departureTime || seg.departureAt,
    arrivalTime: seg.arrivalTime || seg.arrivalAt,
    airline: seg.airline || seg.airlineName || seg.carrierCode || seg.carrier,
    flightNumber: seg.flightNumber,
    duration: seg.duration,
  };
}

export function normalizeFlightOffer(offer = {}) {
  const rawSegments =
    offer.segments || offer.itineraries?.[0]?.segments || [];
  const segments = rawSegments.map(normalizeSegment);
  const first = segments[0];
  const last = segments[segments.length - 1];

  const price =
    offer.lowestPrice ??
    offer.economyPrice ??
    offer.price?.total ??
    offer.totalPrice ??
    (typeof offer.price === "number" ? offer.price : null);

  return {
    ...offer,
    segments,
    airline:
      offer.airlineName ||
      offer.airline ||
      offer.carrierCode ||
      first?.airline ||
      "Airline",
    price,
    currency: offer.currency ?? offer.price?.currency ?? "USD",
    departureTime: offer.departureTime || first?.departureTime,
    arrivalTime: offer.arrivalTime || last?.arrivalTime,
    origin:
      offer.originAirportCode ||
      offer.originAirport ||
      offer.origin ||
      first?.departureAirport,
    destination:
      offer.destinationAirportCode ||
      offer.destinationAirport ||
      offer.destination ||
      last?.arrivalAirport,
    seatsAvailable: offer.availableSeats ?? offer.seatsAvailable,
    duration: offer.duration ?? offer.totalDuration,
    stops: offer.stops ?? Math.max(0, segments.length - 1),
  };
}

/** Pull a flight array from various API response shapes. */
export function extractFlightOffers(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.offers)) return data.offers;
  if (Array.isArray(data.flights)) return data.flights;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export function extractFlightSuggestions(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.suggestions)) return data.suggestions;
  return [];
}
