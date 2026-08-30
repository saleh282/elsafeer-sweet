const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.message || "حدث خطأ غير متوقع");
  }

  return data;
}

function crud(basePath) {
  return {
    list: (token, query = "") => request(`${basePath}${query}`, { token }),
    getById: (token, id) => request(`${basePath}/${id}`, { token }),
    create: (token, body) => request(basePath, { method: "POST", body, token }),
    update: (token, id, body) => request(`${basePath}/${id}`, { method: "PUT", body, token }),
    remove: (token, id) => request(`${basePath}/${id}`, { method: "DELETE", token }),
  };
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  getMe: (token) => request("/auth/me", { token }),

  dashboard: {
    summary: (token, branchId) => request(`/dashboard/summary${branchId ? `?branchId=${branchId}` : ""}`, { token }),
  },

  branches: crud("/branches"),
  categories: crud("/categories"),
  products: crud("/products"),
  rawMaterials: crud("/raw-materials"),
  suppliers: {
    ...crud("/suppliers"),
    balance: (token, id) => request(`/suppliers/${id}/balance`, { token }),
  },

  recipes: {
    list: (token) => request("/recipes", { token }),
    getByProduct: (token, productId) => request(`/recipes/product/${productId}`, { token }),
    create: (token, body) => request("/recipes", { method: "POST", body, token }),
    update: (token, id, body) => request(`/recipes/${id}`, { method: "PUT", body, token }),
    remove: (token, id) => request(`/recipes/${id}`, { method: "DELETE", token }),
  },

  production: {
    list: (token, query = "") => request(`/production${query}`, { token }),
    getById: (token, id) => request(`/production/${id}`, { token }),
    create: (token, body) => request("/production", { method: "POST", body, token }),
  },

  purchases: {
    list: (token, query = "") => request(`/purchases${query}`, { token }),
    getById: (token, id) => request(`/purchases/${id}`, { token }),
    create: (token, body) => request("/purchases", { method: "POST", body, token }),
  },

  payments: {
    create: (token, body) => request("/payments", { method: "POST", body, token }),
    listByInvoice: (token, invoiceId) => request(`/payments/invoice/${invoiceId}`, { token }),
  },

  sales: {
    list: (token, query = "") => request(`/sales${query}`, { token }),
    getById: (token, id) => request(`/sales/${id}`, { token }),
    create: (token, body) => request("/sales", { method: "POST", body, token }),
  },

  returns: {
    list: (token, query = "") => request(`/returns${query}`, { token }),
    create: (token, body) => request("/returns", { method: "POST", body, token }),
  },

  inventory: {
    products: (token, query = "") => request(`/inventory/products${query}`, { token }),
    rawMaterials: (token, query = "") => request(`/inventory/raw-materials${query}`, { token }),
    lowStock: (token, query = "") => request(`/inventory/low-stock${query}`, { token }),
    movements: (token, query = "") => request(`/inventory/movements${query}`, { token }),
  },

  users: {
    list: (token) => request("/users", { token }),
    create: (token, body) => request("/users", { method: "POST", body, token }),
    update: (token, id, body) => request(`/users/${id}`, { method: "PUT", body, token }),
    changeOwnPassword: (token, body) => request("/users/me/password", { method: "PUT", body, token }),
  },

  reports: {
    sales: (token, query = "") => request(`/reports/sales${query}`, { token }),
    purchases: (token, query = "") => request(`/reports/purchases${query}`, { token }),
    production: (token, query = "") => request(`/reports/production${query}`, { token }),
    returns: (token, query = "") => request(`/reports/returns${query}`, { token }),
  },
};

export { ApiError };
