import { Link } from "react-router-dom";
import { Plane, Search, Ticket, Shield } from "lucide-react";
import { MetaTags } from "../../Components/shared/MetaTags";
import { Button } from "../../Components/ui/Button";
import { FlightSearchForm } from "../../Components/shared/FlightSearchForm";

export default function LandingPage() {
  const handleSearch = (params) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    );
    window.location.href = `/flights?${qs}`;
  };

  return (
    <>
      <MetaTags
        title="Book Your Next Journey"
        description="Search flights, compare prices, and verify tickets with SkyRoute Travel Agency."
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Plane className="w-4 h-4" />
              Trusted Travel Agency
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find the best flights at unbeatable prices
            </h1>
            <p className="mt-4 text-lg text-sky-100">
              Search routes across KBL, DXB, IST, DOH and more. Verify your ticket anytime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/flights">
                <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50">
                  <Search className="w-5 h-5" />
                  Search Flights
                </Button>
              </Link>
              <Link to="/verify-ticket">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Ticket className="w-5 h-5" />
                  Verify Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-12 relative z-10 pb-16">
        <FlightSearchForm onSearch={handleSearch} />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Why SkyRoute?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Real-time search",
                desc: "Live flight prices from major airlines via Amadeus integration.",
              },
              {
                icon: Ticket,
                title: "Easy verification",
                desc: "Check your booking status with reference number and phone.",
              },
              {
                icon: Shield,
                title: "Expert agents",
                desc: "Our travel agents handle bookings, changes, and support.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
