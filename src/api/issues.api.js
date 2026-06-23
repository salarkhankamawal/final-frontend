import api from "./client";

export async function listIssues(params = {}) {
  const { data } = await api.get("/api/issues", { params });
  return data;
}

export async function createIssue(payload) {
  const { data } = await api.post("/api/issues", payload);
  return data;
}

export async function getIssue(id) {
  const { data } = await api.get(`/api/issues/${id}`);
  return data;
}

export async function updateIssue(id, payload) {
  const { data } = await api.patch(`/api/issues/${id}`, payload);
  return data;
}

export async function deleteIssue(id) {
  const { data } = await api.delete(`/api/issues/${id}`);
  return data;
}

export async function toggleFavorite(id) {
  const { data } = await api.post(`/api/issues/${id}/favorite`);
  return data;
}

export async function addSubIssue(id, title) {
  const { data } = await api.post(`/api/issues/${id}/sub-issues`, { title });
  return data;
}

export async function toggleSubIssue(issueId, subId) {
  const { data } = await api.patch(`/api/issues/${issueId}/sub-issues/${subId}`);
  return data;
}

export async function listActivity(issueId) {
  const { data } = await api.get(`/api/issues/${issueId}/activity`);
  return data;
}

export async function addComment(issueId, content) {
  const { data } = await api.post(`/api/issues/${issueId}/activity/comments`, { content });
  return data;
}

export async function addReply(issueId, activityId, content) {
  const { data } = await api.post(`/api/issues/${issueId}/activity/${activityId}/replies`, { content });
  return data;
}
