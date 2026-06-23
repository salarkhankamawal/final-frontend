import FlightSearchForm from "./FlightSearchForm";

function HeroSection(props) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/75 via-sky-800/60 to-indigo-900/80" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Hero Text */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-bold text-sky-200 bg-white/10 rounded-full mb-4">
            ✈ Trusted by 50,000+ Travellers
          </span>

          <h1 className="text-5xl font-extrabold text-white">
            Fly Smarter with{" "}
            <span className="text-sky-300">
              Nawi Saadi
            </span>
          </h1>

          <p className="mt-4 text-sky-100 max-w-2xl mx-auto">
            The safest, fastest, and most affordable way
            to book your flights.
          </p>
        </div>

        {/* Search Form */}
        <FlightSearchForm {...props} />

        {/* Popular Destinations */}
        <div className="mt-8 text-center">
          <p className="text-sky-200 mb-3">
            ✈ Popular Destinations
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Dubai 🇦🇪",
              "Istanbul 🇹🇷",
              "London 🇬🇧",
              "Paris 🇫🇷",
            ].map((dest) => (
              <button
                key={dest}
                onClick={() =>
                  props.setTo(dest.split(" ")[0])
                }
                className="px-3 py-2 bg-white/10 text-white rounded-full"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;