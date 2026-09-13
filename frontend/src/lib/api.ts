const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nexora_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    let errorData = null;
    try {
      errorData = await response.json();
      if (typeof errorData?.detail === "string") {
        errorDetail = errorData.detail;
      } else if (Array.isArray(errorData?.detail)) {
        errorDetail = errorData.detail.map((e: any) => e.msg || e.message).join(", ");
      }
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new ApiError(errorDetail, response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// --- Auth APIs ---
export const authApi = {
  register: (data: any) => apiFetch<{ access_token: string; user: any }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => apiFetch<{ access_token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiFetch<any>("/auth/me"),
  updateProfile: (data: any) => apiFetch<any>("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data: any) => apiFetch<any>("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),
  forgotPassword: (email: string) => apiFetch<any>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
};

// --- Domains APIs ---
export const domainsApi = {
  getTlds: () => apiFetch<any[]>("/domains/tlds"),
  search: (query: string) => apiFetch<{ query: string; results: any[] }>(`/domains/search?query=${encodeURIComponent(query)}`),
  getUserDomains: () => apiFetch<any[]>("/domains"),
  getDetails: (id: string) => apiFetch<any>(`/domains/${id}`),
  updateNameservers: (id: string, nameservers: string[]) => apiFetch<any>(`/domains/${id}/nameservers`, { method: "PUT", body: JSON.stringify({ nameservers }) }),
  toggleAutoRenew: (id: string, autoRenew: boolean) => apiFetch<any>(`/domains/${id}/auto-renew?auto_renew=${autoRenew}`, { method: "POST" }),
};

// --- Hosting APIs ---
export const hostingApi = {
  getPlans: () => apiFetch<any[]>("/hosting/plans"),
  getPlan: (slug: string) => apiFetch<any>(`/hosting/plans/${slug}`),
  getUserAccounts: () => apiFetch<any[]>("/hosting"),
  getAccountDetails: (id: string) => apiFetch<any>(`/hosting/${id}`),
};

// --- Cart & Commerce APIs ---
export const cartApi = {
  calculate: (items: any[]) => apiFetch<any>("/cart/calculate", { method: "POST", body: JSON.stringify({ items }) }),
};

export const ordersApi = {
  create: (data: any) => apiFetch<any>("/orders", { method: "POST", body: JSON.stringify(data) }),
  getUserOrders: () => apiFetch<any[]>("/orders"),
  getOrderDetails: (id: string) => apiFetch<any>(`/orders/${id}`),
};

export const paymentsApi = {
  createIntent: (orderId: string, paymentMethod = "CREDIT_CARD") =>
    apiFetch<any>("/payments/create-intent", { method: "POST", body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }) }),
  verify: (data: { order_id: string; transaction_id: string; client_token: string; payment_method?: string }) =>
    apiFetch<any>("/payments/verify", { method: "POST", body: JSON.stringify(data) }),
};

export const invoicesApi = {
  getUserInvoices: () => apiFetch<any[]>("/invoices"),
  getDetails: (id: string) => apiFetch<any>(`/invoices/${id}`),
};

export const renewalsApi = {
  getUserRenewals: () => apiFetch<any[]>("/renewals"),
  toggleAutoRenew: (id: string, auto_renew: boolean) =>
    apiFetch<any>(`/renewals/${id}/toggle-auto-renew`, { method: "POST", body: JSON.stringify({ auto_renew }) }),
  renewNow: (id: string) => apiFetch<any>(`/renewals/${id}/renew-now`, { method: "POST" }),
};

export const supportApi = {
  getUserTickets: () => apiFetch<any[]>("/support/tickets"),
  createTicket: (data: { subject: string; category: string; priority: string; message: string }) =>
    apiFetch<any>("/support/tickets", { method: "POST", body: JSON.stringify(data) }),
  getTicketDetails: (id: string) => apiFetch<any>(`/support/tickets/${id}`),
  addMessage: (id: string, message: string) =>
    apiFetch<any>(`/support/tickets/${id}/messages`, { method: "POST", body: JSON.stringify({ message }) }),
  closeTicket: (id: string) => apiFetch<any>(`/support/tickets/${id}/close`, { method: "POST" }),
};

// --- Admin APIs ---
export const adminApi = {
  getStats: () => apiFetch<any>("/admin/dashboard/stats"),
  getCustomers: (search?: string, status?: string) => {
    let q = "/admin/customers";
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status_filter", status);
    if (params.toString()) q += `?${params.toString()}`;
    return apiFetch<any[]>(q);
  },
  getCustomerDetails: (id: string) => apiFetch<any>(`/admin/customers/${id}`),
  updateCustomerStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/customers/${id}/status?new_status=${status}`, { method: "PUT" }),
  getOrders: (status?: string) =>
    apiFetch<any[]>(status ? `/admin/orders?status_filter=${status}` : "/admin/orders"),
  getOrderDetails: (id: string) => apiFetch<any>(`/admin/orders/${id}`),
  retryProvisioning: (id: string) => apiFetch<any>(`/admin/orders/${id}/retry-provisioning`, { method: "POST" }),
  getHostingPlans: () => apiFetch<any[]>("/admin/products/hosting"),
  createHostingPlan: (data: any) => apiFetch<any>("/admin/products/hosting", { method: "POST", body: JSON.stringify(data) }),
  updateHostingPlan: (id: string, data: any) => apiFetch<any>(`/admin/products/hosting/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getTlds: () => apiFetch<any[]>("/admin/products/tlds"),
  createTld: (data: any) => apiFetch<any>("/admin/products/tlds", { method: "POST", body: JSON.stringify(data) }),
  updateTld: (id: string, data: any) => apiFetch<any>(`/admin/products/tlds/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getTickets: (status?: string, category?: string) => {
    let q = "/admin/support/tickets";
    const params = new URLSearchParams();
    if (status) params.append("status_filter", status);
    if (category) params.append("category_filter", category);
    if (params.toString()) q += `?${params.toString()}`;
    return apiFetch<any[]>(q);
  },
  getTicketDetails: (id: string) => apiFetch<any>(`/admin/support/tickets/${id}`),
  replyTicket: (id: string, message: string) =>
    apiFetch<any>(`/admin/support/tickets/${id}/reply`, { method: "POST", body: JSON.stringify({ message }) }),
  updateTicketStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/support/tickets/${id}/status?new_status=${status}`, { method: "PUT" }),
  getSystemStatus: () => apiFetch<any>("/admin/system/status"),
};
