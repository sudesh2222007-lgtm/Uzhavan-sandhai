import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState("farm_pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product));
    api.get(`/reviews/product/${id}`).then((res) => setReviews(res.data.reviews)).catch(() => {});
  }, [id]);

  const placeOrder = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "customer") return setMsg("Only customers can place orders.");
    setMsg("");
    try {
      await api.post("/orders", {
        productId: id,
        quantity,
        deliveryType,
        deliveryAddress,
        paymentMethod,
      });
      setMsg("✅ ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!");
    } catch (err) {
      setMsg(err.response?.data?.message || "ஆர்டர் செய்ய முடியவில்லை");
    }
  };

  if (!product) return <p className="text-center py-20 text-leaf-600">ஏற்றுகிறது...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="glass-card overflow-hidden">
          <img
            src={product.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=70"}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.slice(1).map((img, i) => (
              <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg" alt="" />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {product.isFreshToday && <span className="badge bg-leaf-600 text-white">🟢 இன்று அறுவடை</span>}
          {product.isSeasonalPick && <span className="badge bg-earth-500 text-white">🌾 பருவகால சிறப்பு</span>}
          {product.isOrganic && <span className="badge bg-leaf-100 text-leaf-700">🌿 இயற்கை</span>}
        </div>
        <h1 className="font-display text-3xl font-bold text-leaf-900">{product.name}</h1>
        <p className="text-gray-500 mb-4">👨‍🌾 {product.farmer?.name} · 📍 {product.farmer?.village}</p>

        <p className="text-3xl font-bold text-leaf-700 mb-2">₹{product.price} / {product.unit}</p>
        <p className="text-sm text-gray-600 mb-4">{product.quantityAvailable} {product.unit} கிடைக்கும் · அறுவடை: {new Date(product.harvestDate).toLocaleDateString("ta-IN")}</p>

        <p className="text-gray-700 mb-6">{product.description}</p>

        <div className="glass-card p-4 mb-6 space-y-1 text-sm text-gray-700">
          <p>{product.homeDeliveryAvailable ? "🚚 வீட்டு டெலிவரி கிடைக்கும்" : "🚚 வீட்டு டெலிவரி இல்லை"}{product.deliveryCharge > 0 && ` (₹${product.deliveryCharge})`}</p>
          <p>{product.farmPickupAvailable ? "🏡 பண்ணை பிக்அப் கிடைக்கும்" : "🏡 பண்ணை பிக்அப் இல்லை"}</p>
          {product.estimatedDeliveryTime && <p>📅 {product.estimatedDeliveryTime}</p>}
          {product.preferredPickupTime && <p>⏰ பிக்அப் நேரம்: {product.preferredPickupTime}</p>}
          <p>📍 டெலிவரி பகுதி: {product.deliveryCoverageKm} கி.மீ வரை</p>
        </div>

        {product.status === "sold_out" ? (
          <p className="text-red-600 font-semibold">விற்பனை முடிந்தது</p>
        ) : (
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">அளவு:</label>
              <input
                type="number"
                min={1}
                max={product.quantityAvailable}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input-field w-24"
              />
              <span className="text-sm text-gray-500">{product.unit}</span>
            </div>

            <div className="flex gap-2">
              {product.farmPickupAvailable && (
                <button onClick={() => setDeliveryType("farm_pickup")} className={`flex-1 py-2 rounded-xl border text-sm ${deliveryType === "farm_pickup" ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300"}`}>🏡 பண்ணை பிக்அப்</button>
              )}
              {product.homeDeliveryAvailable && (
                <button onClick={() => setDeliveryType("home_delivery")} className={`flex-1 py-2 rounded-xl border text-sm ${deliveryType === "home_delivery" ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300"}`}>🚚 வீட்டு டெலிவரி</button>
              )}
            </div>

            {deliveryType === "home_delivery" && (
              <input className="input-field" placeholder="டெலிவரி முகவரி" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
            )}

            <div className="flex gap-2">
              {["cod", "upi"].map((pm) => (
                <button key={pm} onClick={() => setPaymentMethod(pm)} className={`flex-1 py-2 rounded-xl border text-sm ${paymentMethod === pm ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300"}`}>
                  {pm === "cod" ? "💵 டெலிவரி நேரத்தில் பணம்" : "📱 UPI"}
                </button>
              ))}
            </div>

            <p className="text-lg font-bold text-leaf-800">மொத்தம்: ₹{(product.price * quantity + (deliveryType === "home_delivery" ? product.deliveryCharge : 0)).toFixed(2)}</p>

            <button onClick={placeOrder} className="btn-primary w-full">ஆர்டர் செய்யவும்</button>
            {product.farmer?.phone && (
              <a href={`https://wa.me/91${product.farmer.phone}`} target="_blank" rel="noreferrer" className="btn-secondary w-full block text-center">💬 விவசாயியை தொடர்பு கொள்ளவும்</a>
            )}
            {msg && <p className="text-sm text-leaf-700">{msg}</p>}
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-leaf-900 mb-3">⭐ மதிப்புரைகள்</h3>
            <div className="space-y-2">
              {reviews.map((r) => (
                <div key={r._id} className="glass-card p-3 text-sm">
                  <p className="font-medium">{r.customer?.name} · {"⭐".repeat(r.rating)}</p>
                  <p className="text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
