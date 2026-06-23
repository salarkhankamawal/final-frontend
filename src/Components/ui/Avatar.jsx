export function Avatar({ user, size = "md", className = "" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const name = user?.name || user?.email || "?";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizes[size]} inline-flex items-center justify-center rounded-full bg-slate-700 text-white font-medium shrink-0 ${className}`}
    >
      {initials}
    </span>
  );
}
