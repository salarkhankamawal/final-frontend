import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact Us", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img className="w-[200px]" src={logo} alt="Logo" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-sm font-medium ${
                      isActive
                        ? "text-sky-500 border-b-2 border-sky-400 pb-1"
                        : "text-slate-600 hover:text-sky-500"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-sky-300 rounded-full text-sky-600 hover:bg-sky-50 transition-colors"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white hover:from-sky-500 hover:to-indigo-600 transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden p-4 border-t border-slate-100 bg-white">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 ${
                  isActive
                    ? "text-sky-500 border-b-2 border-sky-400 pb-1"
                    : "text-slate-700 hover:text-sky-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 border border-sky-300 rounded-full text-sky-600 text-center"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
