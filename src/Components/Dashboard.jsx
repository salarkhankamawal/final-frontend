import React, { useState, useMemo, useEffect } from "react";
import {
  Plane, PlaneTakeoff, Ticket as TicketIcon, LayoutGrid, ClipboardList,
  Plus, Pencil, Trash2, Search, X, ChevronDown,
  Printer, Send, CalendarClock, ArrowUpDown,
  Eye, Menu, ShieldCheck, ShieldOff,
} from "lucide-react";
import * as bookingsApi from "../api/bookings.api";

/* ============================================================
   MOCK DATA
   ============================================================ */

const seedAirlines = [
  { id: "AL-001", name: "Emirates", code: "EK", country: "United Arab Emirates", fleet: 270, status: "Active" },
  { id: "AL-002", name: "Qatar Airways", code: "QR", country: "Qatar", fleet: 200, status: "Active" },
  { id: "AL-003", name: "Turkish Airlines", code: "TK", country: "Turkey", fleet: 360, status: "Active" },
  { id: "AL-004", name: "Etihad Airways", code: "EY", country: "United Arab Emirates", fleet: 120, status: "Active" },
  { id: "AL-005", name: "Air Arabia", code: "G9", country: "United Arab Emirates", fleet: 55, status: "Active" },
  { id: "AL-006", name: "FlyDubai", code: "FZ", country: "United Arab Emirates", fleet: 60, status: "Active" },
  { id: "AL-007", name: "Kam Air", code: "RQ", country: "Afghanistan", fleet: 12, status: "Active" },
  { id: "AL-008", name: "Ariana Afghan", code: "FG", country: "Afghanistan", fleet: 8, status: "Active" },
];

const seedFlights = [
  { id: "FL-2201", airline: "Skyline Airways", airlineCode: "SK", flightNo: "SK 204", from: "JFK", to: "LHR", departTime: "2026-06-22T18:30", arriveTime: "2026-06-23T06:45", price: 540, seats: 180, booked: 142, status: "Scheduled" },
  { id: "FL-2202", airline: "Azure Air", airlineCode: "AZ", flightNo: "AZ 117", from: "DXB", to: "JFK", departTime: "2026-06-22T02:15", arriveTime: "2026-06-22T08:40", price: 910, seats: 260, booked: 260, status: "Full" },
  { id: "FL-2203", airline: "Northern Wings", airlineCode: "NW", flightNo: "NW 882", from: "YYZ", to: "CDG", departTime: "2026-06-23T20:00", arriveTime: "2026-06-24T08:10", price: 470, seats: 150, booked: 88, status: "Scheduled" },
  { id: "FL-2204", airline: "Meridian Express", airlineCode: "ME", flightNo: "ME 045", from: "LHR", to: "SIN", departTime: "2026-06-24T09:10", arriveTime: "2026-06-24T22:55", price: 690, seats: 210, booked: 95, status: "Scheduled" },
  { id: "FL-2205", airline: "Skyline Airways", airlineCode: "SK", flightNo: "SK 311", from: "LAX", to: "NRT", departTime: "2026-06-21T11:45", arriveTime: "2026-06-22T15:30", price: 780, seats: 200, booked: 0, status: "Cancelled" },
  { id: "FL-2206", airline: "Azure Air", airlineCode: "AZ", flightNo: "AZ 552", from: "DXB", to: "BOM", departTime: "2026-06-25T05:20", arriveTime: "2026-06-25T07:50", price: 215, seats: 220, booked: 178, status: "Scheduled" },
];

const seedBookings = [
  { id: "BK-90011", pnr: "K3F9QL", passenger: "Elena Marsh", email: "elena.marsh@mail.com", flightId: "FL-2201", flightNo: "SK 204", route: "JFK → LHR", date: "2026-06-22", departTime: "2026-06-22T18:30", seat: "14C", fare: "Economy", amount: 540, status: "Confirmed" },
  { id: "BK-90012", pnr: "T7H2WX", passenger: "Devon Okafor", email: "d.okafor@mail.com", flightId: "FL-2202", flightNo: "AZ 117", route: "DXB → JFK", date: "2026-06-22", departTime: "2026-06-22T02:15", seat: "3A", fare: "Business", amount: 2150, status: "Confirmed" },
  { id: "BK-90013", pnr: "P1L8MN", passenger: "Sara Lindqvist", email: "sara.l@mail.com", flightId: "FL-2203", flightNo: "NW 882", route: "YYZ → CDG", date: "2026-06-23", departTime: "2026-06-23T20:00", seat: "22F", fare: "Economy", amount: 470, status: "Pending" },
  { id: "BK-90014", pnr: "Q4D6RZ", passenger: "Marco Bellini", email: "marco.b@mail.com", flightId: "FL-2204", flightNo: "ME 045", route: "LHR → SIN", date: "2026-06-24", departTime: "2026-06-24T09:10", seat: "8B", fare: "Premium", amount: 1120, status: "Confirmed" },
  { id: "BK-90015", pnr: "Y9J3VC", passenger: "Aiko Tanaka", email: "aiko.t@mail.com", flightId: "FL-2205", flightNo: "SK 311", route: "LAX → NRT", date: "2026-06-21", departTime: "2026-06-21T11:45", seat: "17D", fare: "Economy", amount: 780, status: "Cancelled" },
  { id: "BK-90016", pnr: "W2N5BF", passenger: "Liam O'Connor", email: "liam.oc@mail.com", flightId: "FL-2206", flightNo: "AZ 552", route: "DXB → BOM", date: "2026-06-25", departTime: "2026-06-25T05:20", seat: "11A", fare: "Economy", amount: 215, status: "Pending" },
  { id: "BK-90017", pnr: "X6K1ST", passenger: "Nadia Husseini", email: "nadia.h@mail.com", flightId: "FL-2201", flightNo: "SK 204", route: "JFK → LHR", date: "2026-06-22", departTime: "2026-06-22T18:30", seat: "20E", fare: "Economy", amount: 540, status: "Confirmed" },
];

// customers data removed — customer management removed from dashboard

const AIRPORTS = ["JFK", "LHR", "DXB", "YYZ", "CDG", "SIN", "LAX", "NRT", "BOM"];

/* ============================================================
   HELPERS
   ============================================================ */

function fmtMoney(n) {
  return `$${Number(n).toLocaleString("en-US")}`;
}
function fmtDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function genId(prefix) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

function StatusPill({ status }) {
  const map = {
    Active: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800",
    Inactive: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600",
    Scheduled: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800",
    Full: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800",
    Cancelled: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800",
    Confirmed: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800",
    Pending: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800",
    Suspended: "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800",
  };
  return <span className={map[status] || "inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600"}>{status}</span>;
}

function IconButton({ icon, label, onClick, tone = "default" }) {
  const base = "inline-flex items-center justify-center w-8 h-8 rounded-md border bg-white text-slate-700";
  const toneClass = tone === "danger" ? "hover:bg-red-50 border-red-200 text-red-600" : tone === "success" ? "hover:bg-green-50 border-green-200 text-green-600" : "hover:bg-slate-50 border-slate-200";
  return (
    <button type="button" className={`${base} ${toneClass}`} onClick={onClick} aria-label={label} title={label}>
      {icon}
    </button>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="flex flex-col items-center text-center p-12 text-slate-500">
      <div className="text-slate-300 mb-3" aria-hidden="true">{icon}</div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-lg w-full overflow-y-auto shadow-xl" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" className="p-2 rounded hover:bg-slate-100" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel = "Confirm", tone, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} width={520}>
      <p className="confirm-message">{message}</p>
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm text-slate-700" onClick={onCancel}>Cancel</button>
        <button type="button" className={`rounded-md px-3 py-2 text-sm text-white ${tone === "danger" ? "bg-red-600" : "bg-amber-400"}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="mb-4">
      {label && <div className="text-sm font-semibold text-slate-700 mb-2">{label}</div>}
      <div>{children}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}

function AirlineFormFields({ form, setForm }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Name">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Airline name" required />
      </Field>
      <Field label="Code">
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="IATA code" required />
      </Field>
      <Field label="Country">
        <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. United States" required />
      </Field>
      <Field label="Fleet size">
        <input type="number" min="0" value={form.fleet} onChange={(e) => setForm({ ...form, fleet: e.target.value })} placeholder="0" required />
      </Field>
      <Field label="Status">
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </Field>
    </div>
  );
}

function Sidebar({ active, onNavigate, open, onClose }) {
  const items = [
    ["overview", "Overview", LayoutGrid],
    ["airlines", "Airlines", Plane],
    ["flights", "Flights", PlaneTakeoff],
    ["bookings", "Bookings", ClipboardList],
    ["tickets", "Tickets", TicketIcon],
  ];
  return (
    <aside className={`w-64 bg-slate-800 border-r p-4 ${open ? "block" : "hidden md:block"}`}>
      <div className="mb-6 text-lg font-semibold text-white">Admin</div>
      <nav className="flex flex-col gap-2">
        {items.map(([key, label, Icon]) => (
          <button key={key} type="button" className={`text-left px-3 text-white py-2 rounded ${active === key ? "bg-amber-300 font-semibold" : "hover:bg-amber-300"}`} onClick={() => { onNavigate(key); onClose(); }}>
            <span className=""><Icon size={16} /> {label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <button type="button" className="p-2 rounded md:hidden" onClick={onMenuClick} aria-label="Open menu"><Menu size={18} /></button>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-slate-500">{subtitle}</div>
        </div>
      </div>
      <div />
    </header>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-lg flex items-center gap-3">
      <div>{message}</div>
      <button type="button" className="text-sm opacity-80" onClick={onClose}>Close</button>
    </div>
  );
}

function AirlinesView({ airlines, setAirlines, showToast }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editing, setEditing] = useState(null); // airline object or "new"
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", country: "", fleet: "", status: "Active" });

  const filtered = useMemo(() => {
    return airlines.filter((a) => {
      const matchesQuery =
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [airlines, query, statusFilter]);

  function openNew() {
    setForm({ name: "", code: "", country: "", fleet: "", status: "Active" });
    setEditing("new");
  }
  function openEdit(airline) {
    setForm({ name: airline.name, code: airline.code, country: airline.country, fleet: String(airline.fleet), status: airline.status });
    setEditing(airline);
  }
  function saveForm(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.country.trim()) return;
    if (editing === "new") {
      const newAirline = { id: genId("AL"), name: form.name.trim(), code: form.code.trim(), country: form.country.trim(), fleet: Number(form.fleet) || 0, status: form.status };
      setAirlines((prev) => [newAirline, ...prev]);
      showToast(`${newAirline.name} added to the airline roster`);
    } else {
      setAirlines((prev) => prev.map((a) => (a.id === editing.id ? { ...a, name: form.name.trim(), code: form.code.trim(), country: form.country.trim(), fleet: Number(form.fleet) || 0, status: form.status } : a)));
      showToast(`${form.name} updated`);
    }
    setEditing(null);
  }
  function confirmDelete() {
    setAirlines((prev) => prev.filter((a) => a.id !== deleting.id));
    showToast(`${deleting.name} removed`);
    setDeleting(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 bg-white border rounded-md px-3 h-10 flex-1 min-w-[220px]">
          <Search size={16} aria-hidden="true" />
          <input
            className="bg-transparent outline-none w-full text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by airline, code or country"
            aria-label="Search airlines"
          />
        </div>
        <select className="h-10 border rounded-md px-3 bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="button" className="bg-amber-400 text-slate-900 rounded-md px-3 py-2 text-sm font-semibold" onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> Add airline
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<Plane size={28} />} title="No airlines match" message="Try a different search term or clear the status filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Airline</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Code</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Country / base</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Fleet</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Status</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-800">{a.name}</td>
                    <td className="py-3"><span className="font-mono bg-slate-100 rounded px-2 py-1 text-sm">{a.code}</span></td>
                    <td className="py-3 text-sm text-slate-600">{a.country}</td>
                    <td className="py-3 text-sm text-slate-600">{a.fleet}</td>
                    <td className="py-3"><StatusPill status={a.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <IconButton icon={<Pencil size={15} />} label={`Edit ${a.name}`} onClick={() => openEdit(a)} />
                        <IconButton icon={<Trash2 size={15} />} label={`Delete ${a.name}`} tone="danger" onClick={() => setDeleting(a)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add airline" : `Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <form onSubmit={saveForm}>
            <AirlineFormFields form={form} setForm={setForm} />
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm text-slate-700" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="rounded-md px-3 py-2 text-sm text-white bg-amber-400">{editing === "new" ? "Add airline" : "Save changes"}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete airline"
          message={`Remove ${deleting.name} (${deleting.code}) from the roster? This can't be undone.`}
          confirmLabel="Delete airline"
          tone="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function Overview({ airlines, flights, bookings, onNavigate }) {
  const stats = useMemo(() => {
    const activeAirlines = airlines.filter((a) => a.status === "Active").length;
    const scheduledFlights = flights.filter((f) => f.status === "Scheduled" || f.status === "Full").length;
    const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
    const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
    const revenue = bookings.filter((b) => b.status !== "Cancelled").reduce((sum, b) => sum + b.amount, 0);
    const customersCount = new Set(bookings.map((b) => b.email)).size;
    return { activeAirlines, scheduledFlights, confirmedBookings, pendingBookings, revenue, customers: customersCount };
  }, [airlines, flights, bookings]);

  const upcoming = useMemo(
    () => [...flights].filter((f) => f.status !== "Cancelled").sort((a, b) => new Date(a.departTime) - new Date(b.departTime)).slice(0, 5),
    [flights]
  );

  const recentBookings = useMemo(() => [...bookings].slice(-5).reverse(), [bookings]);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" aria-label="Key metrics">
        <div className="bg-slate-800 text-white rounded-lg p-4 border border-slate-700">
          <div className="text-xs uppercase text-slate-300">Active airlines</div>
          <div className="font-mono text-2xl text-amber-400">{String(stats.activeAirlines).padStart(2, "0")}</div>
          <div className="text-sm text-slate-400">of {airlines.length} on file</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-4 border border-slate-700">
          <div className="text-xs uppercase text-slate-300">Flights in motion</div>
          <div className="font-mono text-2xl text-amber-400">{String(stats.scheduledFlights).padStart(2, "0")}</div>
          <div className="text-sm text-slate-400">scheduled or full</div>
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-4 border border-slate-700">
          <div className="text-xs uppercase text-slate-300">Confirmed bookings</div>
          <div className="font-mono text-2xl text-amber-400">{String(stats.confirmedBookings).padStart(2, "0")}</div>
          <div className="text-sm text-slate-400">{stats.pendingBookings} awaiting confirmation</div>
        </div>
        <div className="rounded-lg p-4 border border-amber-500 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <div className="text-xs uppercase text-slate-300">Ticketed revenue</div>
          <div className="font-mono text-2xl text-amber-400">{fmtMoney(stats.revenue)}</div>
          <div className="text-sm text-slate-200">{stats.customers} customers on file</div>
        </div>
      </section>

      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Departure board</h2>
          <button type="button" className="text-sky-600 text-sm" onClick={() => onNavigate("flights")}>
            View all flights
          </button>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-5 gap-4 text-xs uppercase text-slate-500 font-semibold pb-2">
            <span>Flight</span>
            <span>Route</span>
            <span>Departs</span>
            <span>Load</span>
            <span>Status</span>
          </div>
          {upcoming.map((f) => (
            <div className="grid grid-cols-5 gap-4 items-center py-2 border-b last:border-b-0" key={f.id}>
              <span className="font-mono text-sm font-medium">{f.flightNo}</span>
              <span className="flex items-center gap-2 text-sm text-slate-700">{f.from} <ChevronDown size={14} aria-hidden="true" /> {f.to}</span>
              <span className="font-mono text-sm text-slate-600">{fmtDateTime(f.departTime)}</span>
              <span className="font-mono text-sm text-slate-500">{f.booked}/{f.seats}</span>
              <span><StatusPill status={f.status} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Latest bookings</h2>
          <button type="button" className="text-sky-600 text-sm" onClick={() => onNavigate("bookings")}>
            View all bookings
          </button>
        </div>
        <div className="flex flex-col">
          {recentBookings.map((b) => (
            <div className="grid grid-cols-4 items-center gap-4 py-2 border-b last:border-b-0" key={b.id}>
              <div className="font-mono bg-slate-100 rounded px-2 py-1 text-sm">{b.pnr}</div>
              <div className="flex flex-col">
                <span className="font-medium">{b.passenger}</span>
                <span className="text-sm text-slate-500">{b.flightNo} · {b.route}</span>
              </div>
              <div className="font-mono text-sm text-slate-700">{fmtMoney(b.amount)}</div>
              <StatusPill status={b.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   FLIGHTS MODULE
   ============================================================ */

function FlightFormFields({ form, setForm, airlines }) {
  return (
    <div className="form-grid">
      <Field label="Airline">
        <select
          value={form.airline}
          onChange={(e) => {
            const al = airlines.find((a) => a.name === e.target.value);
            setForm({ ...form, airline: e.target.value, airlineCode: al ? al.code : "" });
          }}
          required
        >
          <option value="" disabled>Select airline</option>
          {airlines.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Flight number">
        <input
          value={form.flightNo}
          onChange={(e) => setForm({ ...form, flightNo: e.target.value })}
          placeholder="e.g. SK 204"
          required
        />
      </Field>
      <Field label="From">
        <select value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required>
          <option value="" disabled>Origin airport</option>
          {AIRPORTS.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
      </Field>
      <Field label="To">
        <select value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required>
          <option value="" disabled>Destination airport</option>
          {AIRPORTS.map((code) => <option key={code} value={code}>{code}</option>)}
        </select>
      </Field>
      <Field label="Departure">
        <input
          type="datetime-local"
          value={form.departTime}
          onChange={(e) => setForm({ ...form, departTime: e.target.value })}
          required
        />
      </Field>
      <Field label="Arrival">
        <input
          type="datetime-local"
          value={form.arriveTime}
          onChange={(e) => setForm({ ...form, arriveTime: e.target.value })}
          required
        />
      </Field>
      <Field label="Fare (USD)">
        <input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="0"
          required
        />
      </Field>
      <Field label="Total seats">
        <input
          type="number"
          min="1"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
          placeholder="0"
          required
        />
      </Field>
      <Field label="Status">
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="Scheduled">Scheduled</option>
          <option value="Full">Full</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Field>
    </div>
  );
}

const emptyFlightForm = { airline: "", airlineCode: "", flightNo: "", from: "", to: "", departTime: "", arriveTime: "", price: "", seats: "", status: "Scheduled" };

function FlightsView({ flights, setFlights, airlines, showToast }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyFlightForm);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let list = flights.filter((f) => {
      const matchesQuery =
        f.flightNo.toLowerCase().includes(query.toLowerCase()) ||
        f.airline.toLowerCase().includes(query.toLowerCase()) ||
        f.from.toLowerCase().includes(query.toLowerCase()) ||
        f.to.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || f.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    list = [...list].sort((a, b) => (sortAsc ? 1 : -1) * (new Date(a.departTime) - new Date(b.departTime)));
    return list;
  }, [flights, query, statusFilter, sortAsc]);

  function openNew() {
    setForm(emptyFlightForm);
    setEditing("new");
  }
  function openEdit(flight) {
    setForm({
      airline: flight.airline, airlineCode: flight.airlineCode, flightNo: flight.flightNo,
      from: flight.from, to: flight.to, departTime: flight.departTime, arriveTime: flight.arriveTime,
      price: String(flight.price), seats: String(flight.seats), status: flight.status,
    });
    setEditing(flight);
  }
  function saveForm(e) {
    e.preventDefault();
    if (!form.airline || !form.flightNo.trim() || !form.from || !form.to || !form.departTime || !form.arriveTime) return;
    if (form.from === form.to) { showToast("Origin and destination can't be the same"); return; }
    if (editing === "new") {
      const newFlight = {
        id: genId("FL"), airline: form.airline, airlineCode: form.airlineCode, flightNo: form.flightNo.trim(),
        from: form.from, to: form.to, departTime: form.departTime, arriveTime: form.arriveTime,
        price: Number(form.price) || 0, seats: Number(form.seats) || 0, booked: 0, status: form.status,
      };
      setFlights((prev) => [newFlight, ...prev]);
      showToast(`${newFlight.flightNo} added to the schedule`);
    } else {
      setFlights((prev) => prev.map((f) => (f.id === editing.id ? {
        ...f, airline: form.airline, airlineCode: form.airlineCode, flightNo: form.flightNo.trim(),
        from: form.from, to: form.to, departTime: form.departTime, arriveTime: form.arriveTime,
        price: Number(form.price) || 0, seats: Number(form.seats) || 0, status: form.status,
      } : f)));
      showToast(`${form.flightNo} updated`);
    }
    setEditing(null);
  }
  function confirmDelete() {
    setFlights((prev) => prev.filter((f) => f.id !== deleting.id));
    showToast(`${deleting.flightNo} removed from the schedule`);
    setDeleting(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 bg-white border rounded-md px-3 h-10 flex-1 min-w-[220px]">
          <Search size={16} aria-hidden="true" />
          <input className="bg-transparent outline-none w-full text-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by flight number, airline or airport" aria-label="Search flights" />
        </div>
        <select className="h-10 border rounded-md px-3 bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Full">Full</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm" onClick={() => setSortAsc((s) => !s)}>
          <ArrowUpDown size={15} aria-hidden="true" /> {sortAsc ? "Earliest first" : "Latest first"}
        </button>
        <button type="button" className="bg-amber-400 text-slate-900 rounded-md px-3 py-2 text-sm font-semibold" onClick={openNew}>
          <Plus size={16} aria-hidden="true" /> Add flight
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<PlaneTakeoff size={28} />} title="No flights match" message="Try a different search term or clear the status filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Flight</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Route</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Departs</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Fare</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Load</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Status</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{f.flightNo}</div>
                      <div className="text-sm text-slate-600">{f.airline}</div>
                    </td>
                    <td className="py-3 text-sm text-slate-700">{f.from} <span className="mx-2">→</span> {f.to}</td>
                    <td className="py-3 text-sm">{fmtDateTime(f.departTime)}</td>
                    <td className="py-3 text-sm">{fmtMoney(f.price)}</td>
                    <td className="py-3">
                      <div className="w-40 h-2 bg-slate-100 rounded overflow-hidden mb-1">
                        <div className="h-2 bg-amber-400 rounded" style={{ width: `${Math.min(100, Math.round((f.booked / f.seats) * 100))}%` }} />
                      </div>
                      <div className="text-sm text-slate-500">{f.booked}/{f.seats}</div>
                    </td>
                    <td className="py-3"><StatusPill status={f.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <IconButton icon={<Pencil size={15} />} label={`Edit ${f.flightNo}`} onClick={() => openEdit(f)} />
                        <IconButton icon={<Trash2 size={15} />} label={`Delete ${f.flightNo}`} tone="danger" onClick={() => setDeleting(f)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add flight" : `Edit ${editing.flightNo}`} onClose={() => setEditing(null)} width={640}>
          <form onSubmit={saveForm}>
            <FlightFormFields form={form} setForm={setForm} airlines={airlines} />
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm text-slate-700" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="rounded-md px-3 py-2 text-sm text-white bg-amber-400">{editing === "new" ? "Add flight" : "Save changes"}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete flight"
          message={`Remove ${deleting.flightNo} (${deleting.from} → ${deleting.to}) from the schedule? Any linked bookings will be orphaned.`}
          confirmLabel="Delete flight"
          tone="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   BOOKINGS MODULE
   ============================================================ */

function RescheduleForm({ booking, flights, onSubmit, onCancel }) {
  const candidates = flights.filter((f) => f.from === booking.route.split(" → ")[0] && f.to === booking.route.split(" → ")[1] && f.status !== "Cancelled");
  const [flightId, setFlightId] = useState(booking.flightId);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(flightId); }}>
      <p className="confirm-message">
        Move {booking.passenger}'s booking ({booking.pnr}) to a different departure on the {booking.route} route.
      </p>
      <Field label="New flight">
        <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
          {candidates.length === 0 && <option value={booking.flightId}>{booking.flightNo} — current flight (no alternatives found)</option>}
          {candidates.map((f) => (
            <option key={f.id} value={f.id}>
              {f.flightNo} — departs {fmtDateTime(f.departTime)} · {f.booked}/{f.seats} seats
            </option>
          ))}
        </select>
      </Field>
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm text-slate-700" onClick={onCancel}>Cancel</button>
        <button type="submit" className="rounded-md px-3 py-2 text-sm text-white bg-amber-400" disabled={candidates.length === 0}>Confirm reschedule</button>
      </div>
    </form>
  );
}

function BookingsView({ bookings, setBookings, flights, showToast, onViewTicket }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [rescheduling, setRescheduling] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesQuery =
        b.passenger.toLowerCase().includes(query.toLowerCase()) ||
        b.pnr.toLowerCase().includes(query.toLowerCase()) ||
        b.flightNo.toLowerCase().includes(query.toLowerCase()) ||
        b.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, statusFilter]);

  async function confirmBooking(b) {
    const bookingId = b.id || b._id;
    if (!bookingId) {
      showToast("Booking could not be confirmed because its ID is missing.");
      return;
    }

    try {
      await bookingsApi.confirmBooking(bookingId);
      setBookings((prev) => prev.map((x) => (String(x.id || x._id) === String(bookingId) ? { ...x, status: "Confirmed" } : x)));
      showToast(`Booking ${b.pnr || b.bookingReference || bookingId} confirmed`);
    } catch (error) {
      showToast(error?.message || "Could not confirm booking right now.");
    }
  }
  function cancelBooking() {
    setBookings((prev) => prev.map((x) => (x.id === cancelling.id ? { ...x, status: "Cancelled" } : x)));
    showToast(`Booking ${cancelling.pnr} cancelled`);
    setCancelling(null);
  }
  function rescheduleBooking(newFlightId) {
    const newFlight = flights.find((f) => f.id === newFlightId);
    if (!newFlight) { setRescheduling(null); return; }
    setBookings((prev) => prev.map((x) => (x.id === rescheduling.id ? {
      ...x, flightId: newFlight.id, flightNo: newFlight.flightNo, date: newFlight.departTime.slice(0, 10), departTime: newFlight.departTime,
    } : x)));
    showToast(`Booking ${rescheduling.pnr} moved to ${newFlight.flightNo}`);
    setRescheduling(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border rounded-md px-3 h-10 flex-1">
          <Search size={16} aria-hidden="true" />
          <input className="bg-transparent outline-none w-full text-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by passenger, PNR or flight number" aria-label="Search bookings" />
        </div>
        <select className="h-10 border rounded-md px-3 bg-white text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white border rounded-lg p-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarClock size={28} />} title="No bookings match" message="Try a different search term or clear the status filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">PNR</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Passenger</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Flight</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Seat / fare</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Amount</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Status</th>
                  <th className="text-left text-xs uppercase text-slate-500 font-semibold pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3"><span className="font-mono bg-slate-100 rounded px-2 py-1 text-sm">{b.pnr}</span></td>
                    <td className="py-3">
                      <div className="font-medium">{b.passenger}</div>
                      <div className="text-sm text-slate-500">{b.email}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium">{b.flightNo}</div>
                      <div className="text-sm text-slate-500">{b.route} · {fmtDate(b.date)}</div>
                    </td>
                    <td className="py-3">{b.seat} · {b.fare}</td>
                    <td className="py-3">{fmtMoney(b.amount)}</td>
                    <td className="py-3"><StatusPill status={b.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {b.status === "Pending" && (
                          <IconButton icon={<ShieldCheck size={15} />} label={`Confirm booking ${b.pnr}`} tone="success" onClick={() => confirmBooking(b)} />
                        )}
                        {b.status !== "Cancelled" && (
                          <IconButton icon={<CalendarClock size={15} />} label={`Reschedule booking ${b.pnr}`} onClick={() => setRescheduling(b)} />
                        )}
                        <IconButton icon={<Eye size={15} />} label={`View ticket ${b.pnr}`} onClick={() => onViewTicket(b)} />
                        {b.status !== "Cancelled" && (
                          <IconButton icon={<ShieldOff size={15} />} label={`Cancel booking ${b.pnr}`} tone="danger" onClick={() => setCancelling(b)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rescheduling && (
        <Modal title="Reschedule booking" onClose={() => setRescheduling(null)} width={520}>
          <RescheduleForm booking={rescheduling} flights={flights} onSubmit={rescheduleBooking} onCancel={() => setRescheduling(null)} />
        </Modal>
      )}

      {cancelling && (
        <ConfirmDialog
          title="Cancel booking"
          message={`Cancel ${cancelling.passenger}'s booking (${cancelling.pnr}) on ${cancelling.flightNo}? The seat will be released.`}
          confirmLabel="Cancel booking"
          tone="danger"
          onConfirm={cancelBooking}
          onCancel={() => setCancelling(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   TICKETS MODULE — boarding-pass style ticket detail + print
   ============================================================ */

function BoardingPass({ booking, airline }) {
  return (
    <div className="boarding-pass" id="print-ticket-area">
      <div className="bp-main">
        <div className="bp-head">
          <div className="bp-airline">
            <Plane size={18} aria-hidden="true" />
            <span>{booking.airlineName || airline}</span>
          </div>
          <span className="bp-class">{booking.fare}</span>
        </div>
        <div className="bp-route">
          <div className="bp-airport">
            <span className="bp-code">{booking.route.split(" → ")[0]}</span>
            <span className="bp-airport-label">Origin</span>
          </div>
          <div className="bp-route-line" aria-hidden="true">
            <span className="bp-route-dot" />
            <span className="bp-route-dash" />
            <PlaneTakeoff size={16} />
            <span className="bp-route-dash" />
            <span className="bp-route-dot" />
          </div>
          <div className="bp-airport bp-airport-right">
            <span className="bp-code">{booking.route.split(" → ")[1]}</span>
            <span className="bp-airport-label">Destination</span>
          </div>
        </div>
        <div className="bp-grid">
          <div><span className="bp-label">Passenger</span><span className="bp-value">{booking.passenger}</span></div>
          <div><span className="bp-label">Flight</span><span className="bp-value">{booking.flightNo}</span></div>
          <div><span className="bp-label">Date</span><span className="bp-value">{fmtDate(booking.date)}</span></div>
          <div><span className="bp-label">Boarding</span><span className="bp-value">{booking.departTime ? fmtDateTime(booking.departTime).split(", ")[1] : "—"}</span></div>
          <div><span className="bp-label">Seat</span><span className="bp-value">{booking.seat}</span></div>
          <div><span className="bp-label">PNR</span><span className="bp-value">{booking.pnr}</span></div>
        </div>
      </div>
      <div className="bp-stub">
        <div className="bp-stub-code">{booking.route.replace(" → ", "")}</div>
        <div className="bp-grid bp-stub-grid">
          <div><span className="bp-label">Seat</span><span className="bp-value">{booking.seat}</span></div>
          <div><span className="bp-label">Flight</span><span className="bp-value">{booking.flightNo}</span></div>
        </div>
        <div className="bp-barcode" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} style={{ height: `${20 + ((i * 37) % 60)}%` }} />
          ))}
        </div>
        <span className="bp-pnr-small">{booking.pnr}</span>
      </div>
    </div>
  );
}

function TicketsView({ bookings, airlines, showToast, selectedBooking, setSelectedBooking }) {
  const [query, setQuery] = useState("");

  const ticketable = useMemo(
    () => bookings.filter((b) => b.status !== "Cancelled").filter((b) =>
      b.passenger.toLowerCase().includes(query.toLowerCase()) ||
      b.pnr.toLowerCase().includes(query.toLowerCase()) ||
      b.flightNo.toLowerCase().includes(query.toLowerCase())
    ),
    [bookings, query]
  );

  const active = selectedBooking || ticketable[0] || null;
  const airlineName = active ? (airlines.find((a) => a.code === active.flightNo.split(" ")[0])?.name || active.flightNo.split(" ")[0]) : "";

  function handlePrint() {
    if (!active) return;
    window.print();
    showToast(`Ticket ${active.pnr} sent to printer`);
  }
  function handleSend() {
    if (!active) return;
    showToast(`Ticket emailed to ${active.email}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Ticketed bookings</h2>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 bg-white border rounded-md px-3 h-8">
            <Search size={15} aria-hidden="true" />
            <input className="bg-transparent outline-none text-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a ticket" aria-label="Search tickets" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {ticketable.length === 0 ? (
            <EmptyState icon={<TicketIcon size={24} />} title="No tickets found" message="Confirmed or pending bookings appear here." />
          ) : ticketable.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`flex items-center justify-between p-3 rounded cursor-pointer ${active && active.id === b.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                onClick={() => setSelectedBooking(b)}
              >
                <div>
                  <div className="font-mono text-sm">{b.pnr}</div>
                  <div className="font-medium">{b.passenger}</div>
                  <div className="text-sm text-slate-500">{b.flightNo} · {b.route}</div>
                </div>
                <StatusPill status={b.status} />
              </button>
            ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 md:col-span-2">
        {active ? (
          <>
            <div className="flex items-center justify-end gap-2 mb-3">
              <button type="button" className="bg-white border rounded-md px-3 py-2 text-sm" onClick={handleSend}>
                <Send size={15} aria-hidden="true" /> Send to passenger
              </button>
              <button type="button" className="rounded-md px-3 py-2 text-sm text-white bg-amber-400" onClick={handlePrint}>
                <Printer size={15} aria-hidden="true" /> Print ticket
              </button>
            </div>
            <BoardingPass booking={active} airline={airlineName} />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-500">Passenger email</div>
                <div className="font-medium">{active.email}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Fare paid</div>
                <div className="font-medium">{fmtMoney(active.amount)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Booking status</div>
                <div><StatusPill status={active.status} /></div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState icon={<TicketIcon size={28} />} title="No ticket selected" message="Choose a booking from the list to view its ticket." />
        )}
      </div>
    </div>
  );
}

// Customers module removed — removed `CustomerDetail` and `CustomersView` per request

/* ============================================================
   ROOT APP
   ============================================================ */

/* ============================================================
   STYLES — aviation-night theme: navy/runway-amber, departure
   board motifs, boarding-pass ticket styling
   ============================================================ */

// STYLES removed — dashboard will use Tailwind utility classes instead

const VIEW_TITLES = {
  overview: ["Overview", "Today's schedule, bookings and revenue at a glance"],
  airlines: ["Airlines", "Add, edit and retire airline partners"],
  flights: ["Flights", "Manage the full flight schedule"],
  bookings: ["Bookings", "Confirm, cancel and reschedule passenger bookings"],
  tickets: ["Tickets", "Review, print and send passenger tickets"],
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Dashboard render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Dashboard error</h2>
          <pre className="mt-2 text-sm text-red-600">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardApp() {
  const [view, setView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [airlines, setAirlines] = useState(seedAirlines);
  const [flights, setFlights] = useState(seedFlights);
  const [bookings, setBookings] = useState(seedBookings);
  // customers removed per request
  const [toast, setToast] = useState(null);
  const [ticketBooking, setTicketBooking] = useState(null);

  function showToast(message) {
    setToast(message);
  }

  function goToTicket(booking) {
    setTicketBooking(booking);
    setView("tickets");
  }

  const [title, subtitle] = VIEW_TITLES[view];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar active={view} onNavigate={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 max-w-6xl w-full mx-auto">
          {view === "overview" && (
            <Overview airlines={airlines} flights={flights} bookings={bookings} onNavigate={setView} />
          )}
          {view === "airlines" && (
            <AirlinesView airlines={airlines} setAirlines={setAirlines} showToast={showToast} />
          )}
          {view === "flights" && (
            <FlightsView flights={flights} setFlights={setFlights} airlines={airlines} showToast={showToast} />
          )}
          {view === "bookings" && (
            <BookingsView bookings={bookings} setBookings={setBookings} flights={flights} showToast={showToast} onViewTicket={goToTicket} />
          )}
          {view === "tickets" && (
            <TicketsView bookings={bookings} airlines={airlines} showToast={showToast} selectedBooking={ticketBooking} setSelectedBooking={setTicketBooking} />
          )}
          {/* Customers view removed */}
        </main>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardApp />
    </ErrorBoundary>
  );
}
