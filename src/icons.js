import React from "react";

const base = {
  width: 24,
  height: 24,
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2
};

// Basit çizgisel ikonlar (premium görünüme yakın minimal stil)
export const IconCut = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <circle cx="7" cy="7" r="3" />
    <circle cx="7" cy="17" r="3" />
    <line x1="10" y1="9.5" x2="21" y2="4" />
    <line x1="10" y1="14.5" x2="21" y2="20" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export const IconRazor = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <rect x="3" y="8" width="18" height="8" rx="2" />
    <path d="M7 8v8M17 8v8M10 12h4" />
  </svg>
);

export const IconChild = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20c1.2-3 3.6-4.5 6-4.5s4.8 1.5 6 4.5" />
  </svg>
);

export const IconHotTowel = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <path d="M6 12c0-6 12-6 12 0 0 6-12 6-12 0Z" />
    <path d="M9 10.5c0-2 6-2 6 0 0 2-6 2-6 0Z" />
    <path d="M4 16h16M8 18h8" />
  </svg>
);

export const IconLineUp = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <path d="M4 4h16M4 10h10M4 16h6M4 22h2" />
  </svg>
);

export const IconFade = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <path d="M4 20V8a4 4 0 0 1 4-4h2" />
    <path d="M10 20v-8a4 4 0 0 1 4-4h2" />
    <path d="M16 20v-4a4 4 0 0 1 4-4" />
  </svg>
);

export const IconShampoo = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <rect x="8" y="5" width="8" height="14" rx="2" />
    <path d="M10 5V3h4v2" />
    <path d="M10 9h4" />
  </svg>
);

export const IconFacial = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M9 14s1.5 1 3 1 3-1 3-1" />
    <path d="M9 10h.01M15 10h.01" />
  </svg>
);

export const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" {...base} stroke="currentColor" {...props}>
    <path d="m5 13 4 4 10-10" />
  </svg>
);
