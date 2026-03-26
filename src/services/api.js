async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong.");
  }

  return data;
}

export const api = {
  health: () => apiRequest("/api/health"),
  getAvailability: (serviceId) => apiRequest(`/api/availability?serviceId=${encodeURIComponent(serviceId)}`),
  submitBooking: (payload) =>
    apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  submitContact: (payload) =>
    apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getUatOverview: () => apiRequest("/api/uat/overview"),
  resetUatData: () =>
    apiRequest("/api/uat/reset", {
      method: "POST"
    })
};
