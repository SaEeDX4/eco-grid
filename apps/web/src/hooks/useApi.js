// apps/web/src/hooks/useApi.js
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${import.meta.env.VITE_API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token invalid or missing → redirect to login
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
};
