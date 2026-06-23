import api, { unwrapResponse } from "./client";

export async function verifyTicket(params) {
  const res = await api.get("/tickets/verify", { params });
  return unwrapResponse(res);
}

export async function getTicket(id) {
  const res = await api.get(`/admin/tickets/${id}`);
  return unwrapResponse(res);
}

export async function getTicketPrint(id) {
  const res = await api.get(`/admin/tickets/${id}/print`);
  return unwrapResponse(res);
}
