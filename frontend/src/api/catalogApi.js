const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export function fetchProducts({ search = "", category = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  return request(`/products?${params.toString()}`);
}

export function fetchSummary() {
  return request("/products/analytics/summary");
}

export function fetchTopRated() {
  return request("/products/analytics/top-rated?limit=4");
}

export function fetchLowStock() {
  return request("/products/analytics/low-stock?threshold=3");
}
