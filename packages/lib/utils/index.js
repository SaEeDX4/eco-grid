// Shared utility functions

export const formatCurrency = (amount, currency = "CAD") => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-CA").format(num);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const cn = (...inputs) => {
  // Simple className merger (similar to clsx + tailwind-merge)
  return inputs.filter(Boolean).join(" ");
};
