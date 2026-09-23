const API_URL = import.meta.env.VITE_API_URL;

async function request(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export function getWells({ skip = 0, limit = 500, status, operator, well_type } = {}) {
  const params = new URLSearchParams({ skip, limit });
  if (status) params.set("status", status);
  if (operator) params.set("operator", operator);
  if (well_type) params.set("well_type", well_type);
  return request(`/wells/?${params.toString()}`);
}

export function getWell(id) {
  return request(`/wells/${id}`);
}

export function getWellProduction(id) {
  return request(`/wells/${id}/production`);
}

export function getStatsSummary() {
  return request(`/stats/summary`);
}

export function getProductionTrend() {
  return request(`/stats/production-trend`);
}
