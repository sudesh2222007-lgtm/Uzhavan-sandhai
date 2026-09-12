import React from "react";

/**
 * Themed illustration shown wherever a product list is empty
 * (Home page "fresh produce" section, Products search, Farmer profile, etc).
 * Pure inline SVG in the site's leaf/earth palette - no external image
 * requests, so it never breaks even if the network is offline.
 */
export default function EmptyState({
  title = "தற்போது பொருட்கள் இல்லை",
  message = "பின்னர் மீண்டும் பாருங்கள்.",
  className = "",
}) {
  return (
    <div className={`col-span-full flex flex-col items-center justify-center text-center py-14 px-6 ${className}`}>
      <svg viewBox="0 0 240 200" className="w-52 h-44 mb-5" xmlns="http://www.w3.org/2000/svg">
        {/* soft background */}
        <circle cx="120" cy="102" r="92" fill="#f2f8f0" />
        <circle cx="120" cy="102" r="68" fill="#dfeeda" opacity="0.7" />

        {/* basket handle */}
        <path d="M85 112 Q120 55 155 112" fill="none" stroke="#8a5e30" strokeWidth="5" strokeLinecap="round" />

        {/* basket body */}
        <path
          d="M55 112 L71 178 Q73 185 81 185 L159 185 Q167 185 169 178 L185 112 Z"
          fill="#d9b98a"
          stroke="#b8834a"
          strokeWidth="3"
        />
        {/* weave lines */}
        <line x1="68" y1="128" x2="172" y2="128" stroke="#8a5e30" strokeWidth="2" opacity="0.45" />
        <line x1="72" y1="148" x2="168" y2="148" stroke="#8a5e30" strokeWidth="2" opacity="0.45" />
        <line x1="76" y1="168" x2="164" y2="168" stroke="#8a5e30" strokeWidth="2" opacity="0.45" />
        <line x1="90" y1="112" x2="76" y2="185" stroke="#8a5e30" strokeWidth="1.5" opacity="0.3" />
        <line x1="150" y1="112" x2="164" y2="185" stroke="#8a5e30" strokeWidth="1.5" opacity="0.3" />

        {/* cabbage */}
        <circle cx="90" cy="102" r="26" fill="#4c8c37" />
        <circle cx="90" cy="102" r="16" fill="#a3d191" />
        <circle cx="90" cy="102" r="7" fill="#dfeeda" />

        {/* carrot, tilted */}
        <g transform="rotate(14 143 98)">
          <path
            d="M133,70 C133,65 143,63 153,68 C159,90 152,122 146,130 C144,133 141,133 139,130 C132,110 127,85 133,70 Z"
            fill="#e0813d"
            stroke="#c1682a"
            strokeWidth="1.5"
          />
          <path d="M136,71 L142,124" stroke="#c1682a" strokeWidth="1" opacity="0.4" />
          <path d="M144,70 L146,120" stroke="#c1682a" strokeWidth="1" opacity="0.4" />
        </g>
        {/* carrot leaves */}
        <path d="M138,68 Q128,54 133,45 Q141,56 138,68 Z" fill="#4c8c37" />
        <path d="M144,66 Q144,48 150,42 Q151,58 144,66 Z" fill="#5a9c43" />
        <path d="M149,68 Q160,57 157,46 Q150,56 149,68 Z" fill="#4c8c37" />

        {/* tomato */}
        <circle cx="172" cy="112" r="14" fill="#c1502e" />
        <circle cx="167" cy="107" r="4" fill="#d97050" opacity="0.6" />
        <path d="M167,101 Q172,94 177,101 Q172,97 167,101 Z" fill="#4c8c37" />
      </svg>
      <h3 className="font-display font-semibold text-leaf-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  );
}
