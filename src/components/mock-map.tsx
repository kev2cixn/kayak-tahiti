"use client";

export interface MapLocation {
  name: string;
  district: string;
  x: number;
  y: number;
}

interface MockMapProps {
  location?: MapLocation | null;
}

export default function MockMap({ location }: MockMapProps) {
  const scale = location ? 1.6 : 1;
  const cx = 210; // SVG viewport center X
  const cy = 155; // SVG viewport center Y
  const tx = location ? cx - location.x * scale : 0;
  const ty = location ? cy - location.y * scale : 0;

  const mapTransform = `translate(${tx}px, ${ty}px) scale(${scale})`;

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden">
      <svg
        viewBox="0 0 420 310"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ background: "#d4eaf5" }}
        aria-label="Carte de Tahiti — Lieu de livraison"
      >
        <defs>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c0d8e8" strokeWidth="0.4" />
          </pattern>
        </defs>

        {/* Background grid — fixed */}
        <rect width="420" height="310" fill="url(#grid2)" />

        {/* ── Zoomable map group ── */}
        <g
          style={{
            transformBox: "view-box",
            transformOrigin: "0 0",
            transform: mapTransform,
            transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Lagoon halo */}
          <ellipse cx="188" cy="193" rx="148" ry="135" fill="#c2dff0" opacity="0.5" />

          {/* Tahiti Nui */}
          <path
            d="M 148,90 C 178,62 218,62 248,82 C 278,100 298,135 302,168 C 308,205 298,245 280,270 C 265,292 245,308 222,312 C 198,318 172,313 152,302 C 122,286 96,260 88,232 C 78,202 80,170 90,148 C 100,126 122,104 148,90 Z"
            fill="#f5f0e8"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Mountain interior */}
          <path
            d="M 165,135 C 180,118 210,115 228,128 C 248,142 255,168 250,192 C 244,218 225,238 202,242 C 178,246 158,232 150,210 C 140,186 144,160 165,135 Z"
            fill="#ede8de"
            opacity="0.55"
          />

          {/* Tahiti Iti */}
          <path
            d="M 285,270 C 308,262 345,264 368,278 C 388,292 392,316 382,334 C 370,352 346,360 320,358 C 298,356 280,344 276,328 C 270,310 272,282 285,270 Z"
            fill="#f5f0e8"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Static labels — hidden when zoomed */}
          {!location && (
            <>
              <text x="186" y="195" fontSize="9" fill="#94a3b8" fontWeight="700" letterSpacing="0.15em" textAnchor="middle">
                TAHITI NUI
              </text>
              <text x="330" y="314" fontSize="7" fill="#94a3b8" fontWeight="700" letterSpacing="0.12em" textAnchor="middle">
                TAHITI ITI
              </text>
              <text x="292" y="256" fontSize="5.5" fill="#94a3b8" fontWeight="600" letterSpacing="0.07em">
                ISTHME DE TARAVAO
              </text>
              {/* Reference dots */}
              {[
                { label: "Papeete",      x: 148, y: 105 },
                { label: "Punaauia",     x: 83,  y: 220 },
                { label: "Pointe Vénus", x: 248, y: 90  },
                { label: "Taravao",      x: 288, y: 270 },
              ].map((dot) => (
                <g key={dot.label}>
                  <circle cx={dot.x} cy={dot.y} r="3.5" fill="white" stroke="#94a3b8" strokeWidth="1.2" />
                  <text x={dot.x + 6} y={dot.y + 3.5} fontSize="7" fill="#64748b" fontWeight="600">
                    {dot.label}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* ── Delivery marker ── */}
          {location && (
            <>
              {/* Pulse outer */}
              <circle cx={location.x} cy={location.y} r="16" fill="#192ee2" opacity="0.10">
                <animate attributeName="r" values="12;20;12" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2.2s" repeatCount="indefinite" />
              </circle>
              {/* Ring */}
              <circle cx={location.x} cy={location.y} r="9" fill="none" stroke="#192ee2" strokeWidth="1.5" opacity="0.5" />
              {/* Center */}
              <circle cx={location.x} cy={location.y} r="5" fill="#192ee2" />
              <circle cx={location.x} cy={location.y} r="2.2" fill="white" />
              {/* Shadow cross-hair lines */}
              <line x1={location.x - 14} y1={location.y} x2={location.x - 7} y2={location.y}
                stroke="#192ee2" strokeWidth="1" opacity="0.35" />
              <line x1={location.x + 7} y1={location.y} x2={location.x + 14} y2={location.y}
                stroke="#192ee2" strokeWidth="1" opacity="0.35" />
              <line x1={location.x} y1={location.y - 14} x2={location.x} y2={location.y - 7}
                stroke="#192ee2" strokeWidth="1" opacity="0.35" />
              <line x1={location.x} y1={location.y + 7} x2={location.x} y2={location.y + 14}
                stroke="#192ee2" strokeWidth="1" opacity="0.35" />
            </>
          )}
        </g>

        {/* ── Fixed UI: compass ── */}
        <g transform="translate(396, 34)">
          <text x="0" y="4" fontSize="7" fill="#64748b" fontWeight="800" textAnchor="middle">N</text>
          <line x1="0" y1="6" x2="0" y2="15" stroke="#64748b" strokeWidth="1" />
          <polygon points="0,6 -2,13 0,11 2,13" fill="#192ee2" />
        </g>

        {/* ── Fixed UI: title ── */}
        <text x="210" y="15" fontSize="6.5" fill="#94a3b8" fontWeight="600" letterSpacing="0.18em" textAnchor="middle">
          ZONES DE LIVRAISON
        </text>
      </svg>

      {/* ── Location name badge ── */}
      {location && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-white/92 border-t border-slate-200 px-3 py-2 flex items-center gap-2"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#192ee2] shrink-0" />
          <p className="text-[#192ee2] font-black text-xs tracking-wide truncate">{location.name}</p>
          <span className="text-slate-400 text-xs font-semibold shrink-0 ml-auto">{location.district}</span>
        </div>
      )}
    </div>
  );
}
