const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getServices() {
  const r = await fetch(`${BASE}/api/services`);
  return r.json();
}
export async function getBarbers() {
  const r = await fetch(`${BASE}/api/barbers`);
  return r.json();
}
export async function getAppointments(params = {}) {
  const q = new URLSearchParams(params).toString();
  const r = await fetch(`${BASE}/api/appointments${q ? `?${q}` : ""}`);
  return r.json();
}
export async function createAppointment(payload) {
  const r = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error((await r.json()).error || "Create failed");
  return r.json();
}

// Admin
let adminToken = null;
export function setAdminToken(t) { adminToken = t; }
function authHeaders() { return adminToken ? { Authorization: `Bearer ${adminToken}` } : {}; }

export async function adminLogin(username, password) {
  const r = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!r.ok) throw new Error("Wrong username or password");
  const data = await r.json();
  setAdminToken(data.token);
  return data;
}

export async function adminMetrics() {
  const r = await fetch(`${BASE}/api/admin/metrics`, { headers: authHeaders() });
  if (!r.ok) throw new Error("Unauthorized");
  return r.json();
}
export async function adminAppointments() {
  const r = await fetch(`${BASE}/api/admin/appointments`, { headers: authHeaders() });
  if (!r.ok) throw new Error("Unauthorized");
  return r.json();
}
export async function adminDeleteAppointment(id) {
  const r = await fetch(`${BASE}/api/admin/appointments/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!r.ok) throw new Error("Delete failed");
  return r.json();
}
