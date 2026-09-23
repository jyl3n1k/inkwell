import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Feed", icon: "⌂" },
  { to: "/write", label: "Write", icon: "✎" },
  { to: "/login", label: "Log In", icon: "⇥" },
];

export function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3"
    >
      <Link
        to="/"
        className="flex min-h-[44px] shrink-0 items-center gap-2 text-lg font-bold"
      >
        <img src="/inkwell.svg" alt="" width="28" height="28" />
        <span>Inkwell</span>
      </Link>

      <div className="flex gap-1 lg:gap-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded px-2 ${
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-600"
              }`
            }
          >
            <span aria-hidden="true" className="text-xl">{icon}</span>
            <span className="hidden lg:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
