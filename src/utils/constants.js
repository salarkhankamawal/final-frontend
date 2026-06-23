export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const TOKEN_KEY = "ta_token";
export const AGENT_KEY = "ta_agent";

export const IATA_AIRPORTS = [
  { code: "KBL", city: "Kabul", country: "Afghanistan" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "IST", city: "Istanbul", country: "Turkey" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "ISB", city: "Islamabad", country: "Pakistan" },
  { code: "DEL", city: "Delhi", country: "India" },
];

export const BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

export const BOOKING_STATUS_COLORS = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Completed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
};

export const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Other"];

export const SEAT_CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

export const FLIGHT_SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "duration_asc", label: "Duration: Shortest" },
  { value: "departure_asc", label: "Departure: Earliest" },
];

export const OFFER_VALIDITY_MS = 30 * 60 * 1000;
