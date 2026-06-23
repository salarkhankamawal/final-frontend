import api from "./client";

export async function listProjects() {
  const { data } = await api.get("/api/projects");
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post("/api/projects", payload);
  return data;
}

export async function getProject(id) {
  const { data } = await api.get(`/api/projects/${id}`);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await api.patch(`/api/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/api/projects/${id}`);
  return data;
}

export async function addTeamMember(projectId, payload) {
  const { data } = await api.post(`/api/projects/${projectId}/team`, payload);
  return data;
}

export async function removeTeamMember(projectId, userId) {
  const { data } = await api.delete(`/api/projects/${projectId}/team/${userId}`);
  return data;
}
