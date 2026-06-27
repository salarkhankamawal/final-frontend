import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  CalendarCheck,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import whitelogo from "../../assets/logowhite.png";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/flights", label: "Flights", icon: Plane },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout() {
  const { agent, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const agentName = agent
    ? `${agent.firstName || ""} ${agent.lastName || ""}`.trim() || agent.email
    : "Agent";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform lg:sticky lg:top-0 lg:h-screen lg:self-start lg:translate-x-0 lg:overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <Link to="/admin" className="font-bold text-lg">
            <img src={whitelogo} alt="Nawi Saadi Travel Agency" /> Admin
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-sky-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            className=" w-full justify-start text-white cursor-pointer hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 " />
            Log out
          </Button>
        </div>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{agentName}</p>
            {agent?.agencyName && (
              <p className="text-xs text-slate-500">{agent.agencyName}</p>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
