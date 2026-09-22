const API_URL = import.meta.env.VITE_API_URL;

async function request(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export function getWells({ skip = 0, limit = 500, status, operator } = {}) {
  const params = new URLSearchParams({ skip, limit });
  if (status) params.set("status", status);
  if (operator) params.set("operator", operator);
  return request(`/wells/?${params.toString()}`);
}

export function getWell(id) {
  return request(`/wells/${id}`);
}

export function getWellProduction(id) {
  return request(`/wells/${id}/production`);
}
