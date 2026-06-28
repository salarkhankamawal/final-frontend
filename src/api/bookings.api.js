import api, { unwrapResponse } from "./client";

function normalizeBooking(booking) {
  if (!booking || typeof booking !== "object") return booking;

  const normalized = { ...booking };
  if (!normalized.status && normalized.bookingStatus) {
    normalized.status = normalized.bookingStatus;
  }
  if (!normalized.bookingStatus && normalized.status) {
    normalized.bookingStatus = normalized.status;
  }
  return normalized;
}

function normalizeBookingResponse(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeBooking);
  }

  return normalizeBooking(payload);
}

export async function listBookings(params) {
  const res = await api.get("/admin/bookings", { params });
  return { data: normalizeBookingResponse(unwrapResponse(res)), count: res.data?.count };
}

export async function getBooking(id) {
  const res = await api.get(`/admin/bookings/${id}`);
  return normalizeBookingResponse(unwrapResponse(res));
}

export async function createBooking(payload) {
  const res = await api.post("/admin/bookings", payload);
  return normalizeBookingResponse(unwrapResponse(res));
}

export async function confirmBooking(id) {
  const res = await api.patch(`/admin/bookings/${id}/confirm`);
  return unwrapResponse(res);
}

export async function cancelBooking(id, body = {}) {
  const res = await api.patch(`/admin/bookings/${id}/cancel`, body);
  return normalizeBookingResponse(unwrapResponse(res));
}

export async function rescheduleBooking(id, body) {
  const res = await api.patch(`/admin/bookings/${id}/reschedule`, body);
  return normalizeBookingResponse(unwrapResponse(res));
}
