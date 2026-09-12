import React from "react";
import { Link } from "react-router-dom";

const IMG_FALLBACK = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=60";

export default function ProductCard({ product }) {
  const isFreshToday = product.isFreshToday;
  const img = product.images?.[0] ? product.images[0] : IMG_FALLBACK;

  return (
    <div className="glass-card overflow-hidden group hover:-translate-y-1 hover:shadow-soft transition-all duration-200">
      <div className="relative h-44 overflow-hidden">
        <img
          src={img.startsWith("/uploads") ? img : img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isFreshToday && <span className="badge bg-leaf-600 text-white">🟢 இன்று அறுவடை</span>}
          {product.isSeasonalPick && <span className="badge bg-earth-500 text-white">🌾 பருவகால சிறப்பு</span>}
          {product.isOrganic && <span className="badge bg-leaf-100 text-leaf-700">🌿 இயற்கை</span>}
        </div>
        {product.status === "sold_out" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
            விற்பனை முடிந்தது
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-leaf-900 truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-1">
          📍 {product.farmer?.village || "---"}
          {product.distanceKm != null && ` · ${product.distanceKm} கி.மீ`}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-leaf-700 font-bold">₹{product.price}/{product.unit}</span>
          <span className="text-xs text-gray-500">{product.quantityAvailable} {product.unit} கிடைக்கும்</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2 text-[11px] text-gray-500">
          {product.homeDeliveryAvailable && <span className="badge bg-blue-50 text-blue-700">🚚 வீட்டு டெலிவரி</span>}
          {product.farmPickupAvailable && <span className="badge bg-amber-50 text-amber-700">🏡 பண்ணை பிக்அப்</span>}
          {product.ratingCount > 0 && <span className="badge bg-yellow-50 text-yellow-700">⭐ {product.ratingAverage}</span>}
        </div>

        <div className="flex gap-2 mt-4">
          <Link to={`/products/${product._id}`} className="btn-primary flex-1 text-center text-sm">விவரங்கள்</Link>
          {product.farmer?.phone && (
            <a href={`https://wa.me/91${product.farmer.phone}`} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
              💬
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
