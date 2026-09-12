import React from "react";

// Generic small card used across the Farmer Information Center and Customer
// Information section - icon + title + short body.
export default function InfoCard({ icon, title, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 hover:-translate-y-1 hover:shadow-soft transition-all duration-200 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-semibold text-leaf-900 mb-1">{title}</h4>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}
