import React from 'react';

// Official State Emblem of India (Lion Capital of Ashoka) Vector SVG
export const StateEmblemIndia = ({ className = "h-11 w-auto", fill = "currentColor" }) => (
  <svg
    viewBox="0 0 160 220"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="State Emblem of India"
  >
    {/* Three Lions Silhouette Profile */}
    <g fill={fill}>
      {/* Central Lion Head & Mane */}
      <path d="M80 18 C72 18 67 23 64 29 C61 24 54 22 47 25 C40 28 38 36 39 44 C34 46 31 52 32 58 C33 65 37 70 42 73 C42 82 46 90 53 96 C50 102 48 110 49 118 L58 120 C60 112 63 105 68 100 C71 102 75 103 80 103 C85 103 89 102 92 100 C97 105 100 112 102 120 L111 118 C112 110 110 102 107 96 C114 90 118 82 118 73 C123 70 127 65 128 58 C129 52 126 46 121 44 C122 36 120 28 113 25 C106 22 99 24 96 29 C93 23 88 18 80 18 Z" />
      
      {/* Crown / Top Ears */}
      <circle cx="68" cy="22" r="3.5" />
      <circle cx="92" cy="22" r="3.5" />
      <circle cx="50" cy="30" r="3" />
      <circle cx="110" cy="30" r="3" />

      {/* Central Lion Face Details */}
      <path d="M74 38 C74 36 76 34 80 34 C84 34 86 36 86 38 C86 42 83 45 80 47 C77 45 74 42 74 38 Z" fillOpacity="0.3" />
      <circle cx="72" cy="42" r="2" />
      <circle cx="88" cy="42" r="2" />
      <path d="M78 52 L82 52 L80 56 Z" />
      <path d="M73 60 C75 64 85 64 87 60" stroke={fill} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M77 66 L83 66" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />

      {/* Left Lion Profile Details */}
      <circle cx="48" cy="45" r="1.8" />
      <path d="M42 54 C45 56 49 55 52 53" stroke={fill} strokeWidth="1.5" fill="none" />
      <path d="M37 62 C41 64 47 62 49 59" stroke={fill} strokeWidth="1.5" fill="none" />

      {/* Right Lion Profile Details */}
      <circle cx="112" cy="45" r="1.8" />
      <path d="M118 54 C115 56 111 55 108 53" stroke={fill} strokeWidth="1.5" fill="none" />
      <path d="M123 62 C119 64 113 62 111 59" stroke={fill} strokeWidth="1.5" fill="none" />

      {/* Pillars / Bodies of the Lions */}
      <path d="M56 88 L58 126 L102 126 L104 88 C96 93 84 94 80 94 C76 94 64 93 56 88 Z" />

      {/* Abacus Top Trim */}
      <rect x="36" y="127" width="88" height="6" rx="2" />

      {/* Abacus Band */}
      <rect x="38" y="135" width="84" height="24" rx="1.5" fillOpacity="0.15" stroke={fill} strokeWidth="1.2" />

      {/* Dharma Chakra (Center of Abacus) */}
      <circle cx="80" cy="147" r="9" stroke={fill} strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="147" r="2.5" fill={fill} />
      {/* 24 Spokes representation */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="80"
          y1="147"
          x2={80 + 8 * Math.cos((deg * Math.PI) / 180)}
          y2={147 + 8 * Math.sin((deg * Math.PI) / 180)}
          stroke={fill}
          strokeWidth="0.8"
        />
      ))}

      {/* Left Bull Silhouette Representation on Abacus */}
      <path d="M44 144 C47 141 52 142 55 145 C58 147 60 152 56 154 L44 154 C42 150 42 146 44 144 Z" />
      
      {/* Right Horse Silhouette Representation on Abacus */}
      <path d="M116 144 C113 141 108 142 105 145 C102 147 100 152 104 154 L116 154 C118 150 118 146 116 144 Z" />

      {/* Bell Lotus Base (Inverted Lotus) */}
      <path d="M42 163 C52 173 66 177 80 177 C94 177 108 173 118 163 L114 161 C105 168 93 171 80 171 C67 171 55 168 46 161 Z" />
      <path d="M48 172 C58 180 69 183 80 183 C91 183 102 180 112 172 L110 170 C101 176 91 179 80 179 C69 179 59 176 50 170 Z" />
      <rect x="52" y="184" width="56" height="3" rx="1.5" />
    </g>

    {/* Motto: सत्यमेव जयते (Satyameva Jayate in Devanagari script) */}
    <text
      x="80"
      y="204"
      textAnchor="middle"
      fill={fill}
      fontSize="13"
      fontWeight="bold"
      fontFamily="'Noto Sans Devanagari', 'Mangal', 'Segoe UI Historic', system-ui, sans-serif"
      letterSpacing="0.8"
    >
      सत्यमेव जयते
    </text>
  </svg>
);

// Indian Railways Circular Wheel Crest
export const IndianRailwaysCrest = ({ className = "h-10 w-10", color = "currentColor" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Indian Railways Insignia"
  >
    {/* Outer Rim */}
    <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    
    {/* Steam Locomotive / Electric Train Profile */}
    <g fill={color}>
      {/* Cowcatcher / Pilot */}
      <polygon points="26,72 32,60 38,72" />
      {/* Train Body */}
      <rect x="32" y="42" width="36" height="24" rx="2" />
      {/* Cab & Windows */}
      <rect x="52" y="32" width="16" height="14" rx="1" />
      <rect x="56" y="35" width="10" height="7" rx="0.5" fill="#FFFFFF" fillOpacity="0.8" />
      {/* Chimney / Pantograph */}
      <rect x="36" y="34" width="6" height="8" rx="1" />
      {/* Headlight */}
      <circle cx="32" cy="48" r="3" fill="#FFFFFF" stroke={color} strokeWidth="1" />
      {/* Rails Beneath */}
      <rect x="20" y="74" width="60" height="3" rx="1" />
      <line x1="28" y1="77" x2="24" y2="82" stroke={color} strokeWidth="2.5" />
      <line x1="42" y1="77" x2="40" y2="82" stroke={color} strokeWidth="2.5" />
      <line x1="58" y1="77" x2="60" y2="82" stroke={color} strokeWidth="2.5" />
      <line x1="72" y1="77" x2="76" y2="82" stroke={color} strokeWidth="2.5" />
    </g>

    {/* Stars / Wheel Spokes */}
    <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="0.8" strokeDasharray="1 7" />
  </svg>
);
