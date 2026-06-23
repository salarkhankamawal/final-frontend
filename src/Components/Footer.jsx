import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const COMPANY_LINKS = [
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact Us", path: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Strategy Consulting", path: "/services" },
  { label: "Operations Improvement", path: "/services" },
  { label: "Data & Analytics Advisory", path: "/services" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1BP4bYuzE7/?mibextid=wwXIfr",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.3-3.4.96 0 1.96.17 1.96.17v2.1h-1.08c-1.07 0-1.4.67-1.4 1.35v1.64h2.38l-.38 2.9h-2v7A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nawisaaditravel?igsh=OWhwZHJhZ3Jqa3gy",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-.95.04-1.46.2-1.8.34-.45.17-.78.38-1.12.72-.34.34-.55.67-.72 1.12-.14.34-.3.85-.34 1.8-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.95.2 1.46.34 1.8.17.45.38.78.72 1.12.34.34.67.55 1.12.72.34.14.85.3 1.8.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.95-.04 1.46-.2 1.8-.34.45-.17.78-.38 1.12-.72.34-.34.55-.67.72-1.12.14-.34.3-.85.34-1.8.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.95-.2-1.46-.34-1.8a3 3 0 0 0-.72-1.12 3 3 0 0 0-1.12-.72c-.34-.14-.85-.3-1.8-.34-1.24-.06-1.59-.07-4.74-.07zM12 7.08a4.92 4.92 0 1 1 0 9.84 4.92 4.92 0 0 1 0-9.84zm0 1.62a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm5.4-1.8a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@nawi_saadi_travel?_t=ZS-90vEB6hsi1Y&_r=1",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.27 7.18c-.49-.2-1.02-.33-1.57-.39-.54-.06-1.09-.06-1.61 0v3.04c.4-.06.8-.09 1.21-.09.34 0 .67.02 1 .06v7.16a3.98 3.98 0 01-3.99 3.99A4 4 0 019.3 17.1c0-.07 0-.14.01-.21.01-.28.03-.55.07-.82a4 4 0 013.6-3.2v3.16a1.94 1.94 0 001.94 1.94c.27 0 .54-.04.79-.12V9.33c.44.18.9.28 1.37.28.23 0 .46-.01.69-.05V7.72c-.02 0-.05 0-.07.01z" />
        <path d="M9.3 7.5a4.5 4.5 0 00-4.5 4.5v.02a4.5 4.5 0 004.5 4.5 4.5 4.5 0 004.5-4.5V8.8a6.5 6.5 0 01-8.2-1.3z" opacity="0.0" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@NawiSaadiTravel",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 00.5 6.2 31.9 31.9 0 000 12a31.9 31.9 0 00.5 5.8 3 3 0 002.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 002.1-2.1A31.9 31.9 0 0024 12a31.9 31.9 0 00-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z" />
      </svg>
    ),
  },
];

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Hook up newsletter subscription logic here
    console.log("Newsletter signup:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-white rounded-2xl shadow-xl border border-sky-100  mt-[20px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand + Newsletter */}
          <div className="md:col-span-4">
            <Link to="/">
              <img className="w-[180px]" src={logo} alt="Logo" />
            </Link>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-xs">
              Hello, and welcome to Nawi Saadi Travel & Tourism. 
              We are here to bring you a modern, comfortable, and connected journey, 
              making your travel experience truly unforgettable.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-xs">
              <label
                htmlFor="footer-email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Get occasional insights in your inbox
              </label>
              {subscribed ? (
                <p className="text-sm text-sky-600 font-medium">
                  You're subscribed. Thanks for joining!
                </p>
              ) : (
                <div className="flex gap-2">
                    <input
                      id="footer-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-shadow"
                    />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-sm font-semibold hover:from-sky-500 hover:to-indigo-600 transition-all flex-shrink-0"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Company links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-500 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-500 "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-500">
              <li>
                <a
                  href="mailto:infokbl@nawisaadi.com"
                  className="hover:text-sky-600 transition-colors"
                >
                  infokbl@nawisaadi.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+93 79 820 3051"
                  className="hover:text-sky-600 transition-colors"
                >
                  +93 79 820 3051
                </a>
              </li>
              <li className="leading-relaxed">
                Khost Tower, Jade Maiwand Road, 
                <br />
                Kabul, Afghanistan.
              </li>
            </ul>

            <div className="flex gap-3 mt-5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-sky-200 text-sky-600 flex items-center justify-center hover:bg-sky-50 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Nawi Saadi Travel & Tourism. All rights reserved.
          </p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs text-slate-400 hover:text-sky-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
