import React from "react";
import { Link } from "react-router-dom";

export default function FarmerCard({ farmer }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-leaf-100 flex items-center justify-center text-2xl">👨‍🌾</div>
      <div className="flex-1">
        <h4 className="font-semibold text-leaf-900">{farmer.name}</h4>
        <p className="text-sm text-gray-500">📍 {farmer.village}{farmer.distanceKm != null && ` · ${farmer.distanceKm} கி.மீ`}</p>
      </div>
      <Link to={`/farmers/${farmer._id}`} className="btn-secondary text-sm">சுயவிவரம்</Link>
    </div>
  );
}
