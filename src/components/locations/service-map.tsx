import { locations } from "@/data/locations";
import { cn } from "@/lib/cn";

/*
 * An illustrated service-area map drawn in SVG (not a real map).
 * Real maps need a third-party API key, and these addresses are fictional
 * anyway. The map is an image for sighted users; the same information is
 * in the location list for everyone else, so the map has a text label.
 */
export function ServiceMap({ highlight, className }: { highlight?: string; className?: string }) {
  const active = locations.find((l) => l.id === highlight);
  return (
    <div className={cn("overflow-hidden rounded-card border border-ink-100 bg-brand-50", className)}>
      <svg
        viewBox="0 0 100 70"
        role="img"
        aria-label={
          active
            ? `Illustrated map showing ${active.name} in ${active.address.city}`
            : `Illustrated map of ${locations.length} Northstar Health locations`
        }
        className="block h-full w-full"
      >
        {/* Land texture */}
        <rect width="100" height="70" fill="#eef8fb" />
        {/* Lakes */}
        <ellipse cx="14" cy="18" rx="9" ry="6" fill="#b6e0ec" />
        <ellipse cx="86" cy="12" rx="7" ry="4.5" fill="#b6e0ec" />
        <ellipse cx="80" cy="56" rx="5" ry="3" fill="#b6e0ec" />
        {/* River */}
        <path d="M0 50 C 20 44, 30 56, 50 50 S 80 38, 100 46" stroke="#b6e0ec" strokeWidth="2.6" fill="none" />
        {/* Roads */}
        <g stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round">
          <path d="M48 0 V70" />
          <path d="M0 31 H100" />
          <path d="M10 70 L 60 10 L 100 0" />
          <path d="M22 21 L 48 31 L 72 46" />
        </g>
        {/* Pins */}
        {locations.map((l) => {
          const isActive = l.id === highlight;
          const x = l.mapPosition.x;
          const y = (l.mapPosition.y / 100) * 70;
          return (
            <g key={l.id} transform={`translate(${x} ${y})`} opacity={highlight && !isActive ? 0.45 : 1}>
              <path
                d="M0 0 C -3.2 -3.6, -3.2 -7.6, 0 -7.6 C 3.2 -7.6, 3.2 -3.6, 0 0 Z"
                fill={isActive || !highlight ? "#0e6a8a" : "#4b5b70"}
                stroke="white"
                strokeWidth="0.5"
              />
              <circle cy="-5" r="1.2" fill={isActive ? "#f4b740" : "white"} />
              <text
                y="3.6"
                textAnchor="middle"
                fontSize="2.5"
                fontWeight="600"
                fill="#0e1b2c"
                stroke="white"
                strokeWidth="0.6"
                paintOrder="stroke"
              >
                {l.address.city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
