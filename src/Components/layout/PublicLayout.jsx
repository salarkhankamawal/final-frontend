import { Link, NavLink, Outlet } from "react-router-dom";
import { Plane, Ticket, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

const navLinks = [
  { to: "/flights", label: "Flights" },
  { to: "/verify-ticket", label: "Verify Ticket" },
];

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
            <Plane className="w-6 h-6 text-sky-600" />
            SkyRoute Travel
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-sky-600" : "text-slate-600 hover:text-slate-900"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Link to="/admin">
                <Button size="sm" variant="primary">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline">
                  <LogIn className="w-4 h-4" />
                  Agent Login
                </Button>
              </Link>
            )}
          </nav>
          <button
            type="button"
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-sm font-medium text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className="block"
              onClick={() => setMenuOpen(false)}
            >
              {isAuthenticated ? "Admin Dashboard" : "Agent Login"}
            </Link>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            <span>© {new Date().getFullYear()} SkyRoute Travel Agency</span>
          </div>
          <div className="flex gap-4">
            <Link to="/flights" className="hover:text-slate-700">
              Search Flights
            </Link>
            <Link to="/verify-ticket" className="hover:text-slate-700">
              Verify Ticket
            </Link>
            <Link to="/login" className="hover:text-slate-700">
              Agent Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
