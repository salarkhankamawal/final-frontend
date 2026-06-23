import api, { unwrapResponse } from "./client";

export async function listCustomers(params) {
  const res = await api.get("/admin/customers", { params });
  return { data: unwrapResponse(res), count: res.data?.count };
}

export async function getCustomerByPhone(phone) {
  const res = await api.get(`/admin/customers/phone/${encodeURIComponent(phone)}`);
  return unwrapResponse(res);
}

export async function getCustomer(id) {
  const res = await api.get(`/admin/customers/${id}`);
  return unwrapResponse(res);
}

export async function updateCustomer(id, payload) {
  const res = await api.put(`/admin/customers/${id}`, payload);
  return unwrapResponse(res);
}

export async function getCustomerTickets(id) {
  const res = await api.get(`/admin/customers/${id}/tickets`);
  return unwrapResponse(res);
}
