import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

export default function FarmerProfile() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const isFav = user?.favouriteFarmers?.includes(id);
  const toggleFav = async () => {
    const res = await api.patch(`/users/favourites/${id}`);
    setUser((u) => ({ ...u, favouriteFarmers: res.data.favouriteFarmers }));
  };

  useEffect(() => {
    api.get(`/users/farmer/${id}`).then((res) => setFarmer(res.data.farmer));
    api.get("/products", { params: { farmerId: id } }).then((res) => setProducts(res.data.products));
    api.get(`/reviews/farmer/${id}`).then((res) => setReviews(res.data.reviews)).catch(() => {});
  }, [id]);

  if (!farmer) return <p className="text-center py-20 text-leaf-600">ஏற்றுகிறது...</p>;

  const mapsUrl = farmer.farmLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${farmer.farmLocation.lat},${farmer.farmLocation.lng}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-leaf-100 flex items-center justify-center text-4xl">👨‍🌾</div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-2xl font-bold text-leaf-900">{farmer.name}</h1>
          <p className="text-gray-500">📍 {farmer.village}</p>
          {reviews.length > 0 && (
            <p className="text-sm text-yellow-600 mt-1">⭐ {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} மதிப்புரைகள்)</p>
          )}
        </div>
        <div className="flex gap-2">
          {user?.role === "customer" && (
            <button onClick={toggleFav} className="btn-secondary">{isFav ? "❤️ பிடித்தது" : "🤍 பிடித்தவையில் சேர்"}</button>
          )}
          {farmer.phone && (
            <a href={`https://wa.me/91${farmer.phone}`} target="_blank" rel="noreferrer" className="btn-secondary">💬 WhatsApp</a>
          )}
          {mapsUrl && <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-primary">🧭 வழி காட்டு</a>}
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">பொருட்கள்</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
        {products.length === 0 && (
          <EmptyState title="தற்போது பொருட்கள் இல்லை" message="இந்த விவசாயி விரைவில் புதிய பொருட்களை சேர்ப்பார்." />
        )}
      </div>

      {reviews.length > 0 && (
        <>
          <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">மதிப்புரைகள்</h2>
          <div className="space-y-2">
            {reviews.map((r) => (
              <div key={r._id} className="glass-card p-3 text-sm">
                <p className="font-medium">{r.customer?.name} · {"⭐".repeat(r.rating)}</p>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
