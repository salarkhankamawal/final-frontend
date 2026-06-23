import DestinationCard from "./DestinationCard";

function DestinationsSection({
  visibleDests,
  setTo,
  showAll,
  setShowAll,
}) {
  return (
    <section className="mb-24 md:mb-6">
      <div className="text-center">
      <button className="bg-sky-500 text-white px-4 py-2 rounded-full mb-5 mt-5 cursor-pointer"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Show Less" : "View All"}
      </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {visibleDests.map((dest) => (
          <DestinationCard
            key={dest.city}
            {...dest}
            onClick={() => setTo(dest.city)}
          />
        ))}
      </div>
    </section>
  );
}

export default DestinationsSection;