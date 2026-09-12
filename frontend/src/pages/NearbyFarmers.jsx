import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FarmerCard from "../components/FarmerCard";
import useGeolocation from "../hooks/useGeolocation";

export default function NearbyFarmers() {
  const { coords, error, loading: geoLoading, request } = useGeolocation(true);
  const [farmers, setFarmers] = useState([]);
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    api
      .get("/products/nearby-farmers", { params: { lat: coords.lat, lng: coords.lng, radiusKm } })
      .then((res) => setFarmers(res.data.farmers))
      .finally(() => setLoading(false));
  }, [coords, radiusKm]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-2">அருகிலுள்ள விவசாயிகள்</h1>
      <p className="text-gray-500 mb-6">உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள விவசாயிகளைக் காணுங்கள்.</p>

      {error && (
        <div className="glass-card p-4 mb-6 text-sm text-red-600">
          {error} <button onClick={request} className="underline ml-2">மீண்டும் முயற்சிக்கவும்</button>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {[5, 10, 20].map((r) => (
          <button key={r} onClick={() => setRadiusKm(r)} className={`px-4 py-2 rounded-xl border text-sm ${radiusKm === r ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300"}`}>
            {r} கி.மீ
          </button>
        ))}
      </div>

      {geoLoading || loading ? (
        <p className="text-leaf-600">ஏற்றுகிறது...</p>
      ) : farmers.length === 0 ? (
        <p className="text-gray-500">இந்த பகுதியில் விவசாயிகள் இல்லை.</p>
      ) : (
        <div className="space-y-3">
          {farmers.map((f) => <FarmerCard key={f._id} farmer={f} />)}
        </div>
      )}
    </div>
  );
}
