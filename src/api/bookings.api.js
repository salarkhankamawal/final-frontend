import api, { unwrapResponse } from "./client";

export async function listBookings(params) {
  const res = await api.get("/admin/bookings", { params });
  return { data: unwrapResponse(res), count: res.data?.count };
}

export async function getBooking(id) {
  const res = await api.get(`/admin/bookings/${id}`);
  return unwrapResponse(res);
}

export async function createBooking(payload) {
  const res = await api.post("/admin/bookings", payload);
  return unwrapResponse(res);
}

export async function confirmBooking(id) {
  const res = await api.patch(`/admin/bookings/${id}/confirm`);
  return unwrapResponse(res);
}

export async function cancelBooking(id, body = {}) {
  const res = await api.patch(`/admin/bookings/${id}/cancel`, body);
  return unwrapResponse(res);
}

export async function rescheduleBooking(id, body) {
  const res = await api.patch(`/admin/bookings/${id}/reschedule`, body);
  return unwrapResponse(res);
}
