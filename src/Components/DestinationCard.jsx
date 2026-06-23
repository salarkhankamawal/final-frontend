function DestinationCard({
  city,
  country,
  price,
  duration,
  tag,
  tagColor,
  image,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer h-60"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 rounded ${tagColor}`}>
          {tag}
        </span>
      </div>

      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-xl font-bold">
          {city}
        </h3>

        <p className="text-white">{country}</p>

        <p className="text-sky-300">{price}</p>

        <p className="text-white text-sm">
          {duration}
        </p>
      </div>
    </div>
  );
}

export default DestinationCard;