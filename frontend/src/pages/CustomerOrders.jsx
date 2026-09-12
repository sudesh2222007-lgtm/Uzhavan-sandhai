import React, { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_LABEL = {
  pending: "காத்திருக்கிறது", accepted: "ஏற்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது",
  out_for_delivery: "டெலிவரிக்கு சென்றுள்ளது", completed: "முடிந்தது", cancelled: "ரத்து செய்யப்பட்டது",
};

// Farm address is only revealed to the buyer once the farmer has accepted
// the order (before that there's nothing confirmed yet to travel to).
const FARM_ADDRESS_VISIBLE_STATUSES = ["accepted", "out_for_delivery", "completed"];

function FarmPickupInfo({ order }) {
  if (order.deliveryType !== "farm_pickup") return null;

  if (!FARM_ADDRESS_VISIBLE_STATUSES.includes(order.status)) {
    return (
      <div className="mt-3 pt-3 border-t border-leaf-100 text-sm text-gray-500">
        🏡 பண்ணை பிக்அப் — விவசாயி ஆர்டரை ஏற்றவுடன் பண்ணையின் முகவரி இங்கே காண்பிக்கப்படும்.
      </div>
    );
  }

  const loc = order.farmer?.farmLocation;
  const hasCoords = loc && loc.lat != null && loc.lng != null;
  const mapsUrl = hasCoords ? `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}` : null;

  return (
    <div className="mt-3 pt-3 border-t border-leaf-100">
      <p className="text-sm font-semibold text-leaf-900 mb-1">🏡 பண்ணை பிக்அப் முகவரி</p>
      <p className="text-sm text-gray-600 mb-2">📍 {order.farmer?.village || "விவசாயியை தொடர்பு கொள்ளவும்"}</p>
      <div className="flex flex-wrap gap-2">
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
            🧭 வழி காட்டு
          </a>
        )}
        {order.farmer?.phone && (
          <>
            <a href={`https://wa.me/91${order.farmer.phone}`} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
              💬 WhatsApp
            </a>
            <a href={`tel:${order.farmer.phone}`} className="btn-secondary text-sm">
              📞 அழைக்க
            </a>
          </>
        )}
      </div>
      {!hasCoords && (
        <p className="text-xs text-gray-400 mt-2">விவசாயி இன்னும் GPS இருப்பிடத்தை பதிவு செய்யவில்லை — ஊரின் பெயரைப் பயன்படுத்தி தொடர்பு கொள்ளவும்.</p>
      )}
    </div>
  );
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/orders/mine").then((res) => setOrders(res.data.orders));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("இந்த ஆர்டரை ரத்து செய்ய வேண்டுமா?")) return;
    await api.patch(`/orders/${id}/cancel`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-6">என் ஆர்டர்கள்</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="glass-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <img src={o.product?.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60"} className="w-16 h-16 rounded-lg object-cover" alt="" />
              <div className="flex-1">
                <p className="font-semibold text-leaf-900">{o.product?.name} × {o.quantity} {o.product?.unit}</p>
                <p className="text-sm text-gray-500">👨‍🌾 {o.farmer?.name} · ₹{o.totalPrice}</p>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <span className="badge bg-leaf-100 text-leaf-700">{STATUS_LABEL[o.status] || o.status}</span>
                  <span className="badge bg-amber-50 text-amber-700">
                    {o.deliveryType === "farm_pickup" ? "🏡 பண்ணை பிக்அப்" : "🚚 வீட்டு டெலிவரி"}
                  </span>
                </div>
              </div>
              {["pending", "accepted"].includes(o.status) && (
                <button onClick={() => cancel(o._id)} className="text-sm px-4 py-2 rounded-xl border border-red-300 text-red-600 self-start sm:self-center">ரத்து செய்</button>
              )}
            </div>

            <FarmPickupInfo order={o} />
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-500">நீங்கள் இன்னும் ஆர்டர் செய்யவில்லை.</p>}
      </div>
    </div>
  );
}

