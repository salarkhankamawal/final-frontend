function PassengerCounter({
  label,
  sublabel,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          -
        </button>

        <span>{value}</span>

        <button
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default PassengerCounter;