import api, { unwrapResponse } from "./client";

export async function searchFlights(params) {
  const res = await api.get("/flights", { params });
  return unwrapResponse(res);
}

export async function getFlightSuggestions(params) {
  const res = await api.get("/flights/suggestions", { params });
  return unwrapResponse(res);
}

export async function getFlightOffer(offerId) {
  const res = await api.get(`/flights/${offerId}`);
  return unwrapResponse(res);
}

export async function adminSearchFlights(params) {
  const res = await api.get("/admin/flights/search", { params });
  return unwrapResponse(res);
}

export async function adminGetFlightOffer(offerId) {
  const res = await api.get(`/admin/flights/offers/${offerId}`);
  return unwrapResponse(res);
}
