import api from "../api/Config";

function unwrap(res) {
  return res?.data?.data;
}

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getPublicProperties(filters) {
  const res = await api.get(`/properties${buildQuery(filters)}`);
  return unwrap(res) || [];
}

export async function getPublicProperty(id) {
  const res = await api.get(`/properties/${id}`);
  return unwrap(res);
}

export async function getCustomerDashboard(filters) {
  const res = await api.get(`/customer/dashboard${buildQuery(filters)}`);
  return unwrap(res) || [];
}

export async function getCustomerProperty(id) {
  const res = await api.get(`/customer/properties/${id}`);
  return unwrap(res);
}

export async function getOwnerDashboard() {
  const res = await api.get("/owner/dashboard");
  return unwrap(res) || [];
}

function buildOwnerFormData(form) {
  const data = new FormData();
  data.append("title", form.title);
  data.append("description", form.description || "");
  data.append("price", form.price);
  data.append("type", form.type);
  data.append("city", form.city);
  data.append("location", form.location);
  if (form.imageUrl) data.append("imageUrl", form.imageUrl);
  return data;
}

export async function createOwnerProperty(form) {
  const res = await api.post("/owner/properties", buildOwnerFormData(form), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export async function updateOwnerProperty(id, form) {
  const res = await api.put(`/owner/properties/${id}`, buildOwnerFormData(form), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

export function deleteOwnerProperty(id) {
  return api.delete(`/owner/properties/${id}`);
}

export async function getAdminUsers() {
  const res = await api.get("/admin/users");
  return unwrap(res) || [];
}

export async function updateAdminUser(id, payload) {
  const res = await api.put(`/admin/users/${id}`, payload);
  return unwrap(res);
}

export function deleteAdminUser(id) {
  return api.delete(`/admin/users/${id}`);
}

export async function getPendingProperties() {
  const res = await api.get("/admin/properties/pending");
  return unwrap(res) || [];
}

export async function getClosedProperties() {
  const res = await api.get("/admin/properties/closed");
  return unwrap(res) || [];
}

export async function approveProperty(id) {
  const res = await api.patch(`/admin/properties/${id}/approve`);
  return unwrap(res);
}

export async function closeProperty(id, payload) {
  const res = await api.patch(`/admin/properties/${id}/close`, payload);
  return unwrap(res);
}

export function deleteAdminProperty(id) {
  return api.delete(`/admin/properties/${id}`);
}
