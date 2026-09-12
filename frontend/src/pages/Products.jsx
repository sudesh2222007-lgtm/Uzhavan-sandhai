import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import useGeolocation from "../hooks/useGeolocation";

const CATEGORIES = ["காய்கறி", "பழம்", "தானியம்", "பால் பொருள்", "மற்றவை"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState("");
  const [organic, setOrganic] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [radiusKm, setRadiusKm] = useState("");
  const { coords, request: requestLocation, loading: geoLoading } = useGeolocation(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      if (organic) params.organic = true;
      if (seasonal) params.seasonal = true;
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
        if (radiusKm) params.radiusKm = radiusKm;
      }
      const res = await api.get("/products", { params });
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, organic, seasonal, coords, radiusKm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-6">பொருட்கள்</h1>

      <div className="glass-card p-4 mb-8 grid grid-cols-1 md:grid-cols-6 gap-3">
        <form onSubmit={(e) => { e.preventDefault(); fetchProducts(); }} className="md:col-span-2 flex gap-2">
          <input
            className="input-field"
            placeholder="தேடு..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary">🔍</button>
        </form>

        <select className="input-field" value={category} onChange={(e) => { setCategory(e.target.value); setSearchParams(e.target.value ? { category: e.target.value } : {}); }}>
          <option value="">அனைத்து வகைகள்</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          type="number"
          className="input-field"
          placeholder="அதிகபட்ச விலை (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={fetchProducts}
        />

        <select className="input-field" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} disabled={!coords}>
          <option value="">தூரம் (எல்லாம்)</option>
          <option value="5">5 கி.மீ</option>
          <option value="10">10 கி.மீ</option>
          <option value="20">20 கி.மீ</option>
        </select>

        <button type="button" onClick={requestLocation} className="btn-secondary text-sm">
          {geoLoading ? "..." : coords ? "📍 அருகில்" : "📍 இருப்பிடம்"}
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={organic} onChange={(e) => setOrganic(e.target.checked)} /> இயற்கை மட்டும்
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={seasonal} onChange={(e) => setSeasonal(e.target.checked)} /> பருவகாலம் மட்டும்
        </label>
      </div>

      {loading ? (
        <p className="text-center py-16 text-leaf-600">ஏற்றுகிறது...</p>
      ) : products.length === 0 ? (
        <EmptyState
          title="பொருட்கள் எதுவும் கிடைக்கவில்லை"
          message="வடிகட்டிகளை மாற்றி முயற்சிக்கவும் அல்லது பின்னர் பாருங்கள்."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
