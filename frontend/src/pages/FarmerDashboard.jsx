import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["காய்கறி", "பழம்", "தானியம்", "பால் பொருள்", "மற்றவை"];
const SEASONS = ["கோடை", "மழைக்காலம்", "குளிர்காலம்", "ஆண்டு முழுவதும்"];

const emptyForm = {
  name: "", category: CATEGORIES[0], price: "", quantityAvailable: "", unit: "kg",
  harvestDate: "", isOrganic: false, description: "", season: SEASONS[3], isSeasonalPick: false,
  homeDeliveryAvailable: false, farmPickupAvailable: true, deliveryCharge: 0,
  estimatedDeliveryTime: "", deliveryCoverageKm: 10, preferredPickupTime: "",
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState("");

  const loadProducts = () => api.get("/products/mine").then((res) => setProducts(res.data.products));
  const loadOrders = () => api.get("/orders/farmer").then((res) => setOrders(res.data.orders));

  useEffect(() => { loadProducts(); loadOrders(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setImages([]); };

  const submitProduct = async (e) => {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append("images", img));

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setMsg("✅ பொருள் புதுப்பிக்கப்பட்டது");
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setMsg("✅ புதிய பொருள் சேர்க்கப்பட்டது");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMsg(err.response?.data?.message || "பிழை ஏற்பட்டது");
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, category: p.category, price: p.price, quantityAvailable: p.quantityAvailable, unit: p.unit,
      harvestDate: p.harvestDate?.slice(0, 10), isOrganic: p.isOrganic, description: p.description || "",
      season: p.season, isSeasonalPick: p.isSeasonalPick, homeDeliveryAvailable: p.homeDeliveryAvailable,
      farmPickupAvailable: p.farmPickupAvailable, deliveryCharge: p.deliveryCharge,
      estimatedDeliveryTime: p.estimatedDeliveryTime, deliveryCoverageKm: p.deliveryCoverageKm,
      preferredPickupTime: p.preferredPickupTime,
    });
    setTab("add");
  };

  const deleteProduct = async (id) => {
    if (!confirm("இந்த பொருளை நீக்க வேண்டுமா?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const toggleSoldOut = async (p) => {
    await api.patch(`/products/${p._id}/status`, { status: p.status === "sold_out" ? "available" : "sold_out" });
    loadProducts();
  };

  const respond = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/respond`, { status });
    loadOrders();
    loadProducts();
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const salesHistory = orders.filter((o) => o.status !== "pending");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-1">வணக்கம், {user?.name} 👋</h1>
      <p className="text-gray-500 mb-6">{user?.village} · விவசாயி டாஷ்போர்டு</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {[["products", "என் பொருட்கள்"], ["add", editingId ? "பொருள் திருத்து" : "புதிய பொருள்"], ["orders", `ஆர்டர் விசாரணைகள் (${pendingOrders.length})`], ["sales", "விற்பனை வரலாறு"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl font-medium text-sm border ${tab === k ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300 text-gray-600"}`}>
            {l}
          </button>
        ))}
        <Link to="/farmer/info-center" className="px-4 py-2 rounded-xl font-medium text-sm border border-earth-300 text-earth-700 ml-auto">🌾 விவசாய தகவல் மையம்</Link>
      </div>

      {tab === "products" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p._id} className="glass-card p-4">
              <img src={p.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=60"} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />
              <h3 className="font-semibold text-leaf-900">{p.name}</h3>
              <p className="text-sm text-gray-500">₹{p.price}/{p.unit} · {p.quantityAvailable} {p.unit}</p>
              <p className={`text-xs mt-1 font-medium ${p.status === "sold_out" ? "text-red-600" : "text-leaf-600"}`}>
                {p.status === "sold_out" ? "விற்பனை முடிந்தது" : "கிடைக்கிறது"}
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => editProduct(p)} className="btn-secondary text-xs flex-1">✏️ திருத்து</button>
                <button onClick={() => toggleSoldOut(p)} className="btn-secondary text-xs flex-1">🔄 நிலை</button>
                <button onClick={() => deleteProduct(p._id)} className="text-xs flex-1 text-red-600 border border-red-200 rounded-xl">🗑️ நீக்கு</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-gray-500 col-span-full">நீங்கள் இன்னும் பொருட்கள் சேர்க்கவில்லை.</p>}
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={submitProduct} className="glass-card p-6 max-w-3xl space-y-4">
          {msg && <p className="text-sm text-leaf-700 bg-leaf-50 p-2 rounded-lg">{msg}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">பொருள் பெயர்</label>
              <input required className="input-field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">வகை</label>
              <select className="input-field mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">விலை (₹)</label>
              <input required type="number" min="0" className="input-field mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium">கிடைக்கும் அளவு</label>
                <input required type="number" min="0" className="input-field mt-1" value={form.quantityAvailable} onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })} />
              </div>
              <div className="w-28">
                <label className="text-sm font-medium">அலகு</label>
                <select className="input-field mt-1" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  {["kg", "g", "dozen", "litre", "piece"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">அறுவடை தேதி</label>
              <input required type="date" className="input-field mt-1" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">பருவகாலம்</label>
              <select className="input-field mt-1" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                {SEASONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">விளக்கம்</label>
            <textarea className="input-field mt-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isOrganic} onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })} /> 🌿 இயற்கை பொருள்</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSeasonalPick} onChange={(e) => setForm({ ...form, isSeasonalPick: e.target.checked })} /> 🌾 பருவகால சிறப்பு</label>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-leaf-900 mb-2">🚚 டெலிவரி விவரங்கள்</h4>
            <div className="flex flex-wrap gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.homeDeliveryAvailable} onChange={(e) => setForm({ ...form, homeDeliveryAvailable: e.target.checked })} /> வீட்டு டெலிவரி</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.farmPickupAvailable} onChange={(e) => setForm({ ...form, farmPickupAvailable: e.target.checked })} /> பண்ணை பிக்அப்</label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">டெலிவரி கட்டணம் (₹)</label>
                <input type="number" min="0" className="input-field mt-1" value={form.deliveryCharge} onChange={(e) => setForm({ ...form, deliveryCharge: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">டெலிவரி பகுதி (கி.மீ)</label>
                <input type="number" min="0" className="input-field mt-1" value={form.deliveryCoverageKm} onChange={(e) => setForm({ ...form, deliveryCoverageKm: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">எதிர்பார்க்கப்படும் நேரம்</label>
                <input placeholder="எ.கா. அதே நாள்" className="input-field mt-1" value={form.estimatedDeliveryTime} onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">பிக்அப் நேரம்</label>
                <input placeholder="எ.கா. காலை 7-9" className="input-field mt-1" value={form.preferredPickupTime} onChange={(e) => setForm({ ...form, preferredPickupTime: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">படங்கள் (அதிகபட்சம் 5)</label>
            <input type="file" accept="image/*" multiple className="input-field mt-1" onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
          </div>

          <div className="flex gap-3">
            <button className="btn-primary">{editingId ? "புதுப்பிக்கவும்" : "பொருள் சேர்க்கவும்"}</button>
            {editingId && <button type="button" onClick={resetForm} className="btn-secondary">ரத்து செய்</button>}
          </div>
        </form>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {pendingOrders.map((o) => (
            <div key={o._id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-leaf-900">{o.product?.name} × {o.quantity} {o.product?.unit}</p>
                <p className="text-sm text-gray-500">வாடிக்கையாளர்: {o.customer?.name} · 📞 {o.customer?.phone}</p>
                <p className="text-sm text-gray-500">{o.deliveryType === "home_delivery" ? "🚚 வீட்டு டெலிவரி" : "🏡 பண்ணை பிக்அப்"} · மொத்தம்: ₹{o.totalPrice}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => respond(o._id, "accepted")} className="btn-primary text-sm">✅ ஏற்கவும்</button>
                <button onClick={() => respond(o._id, "rejected")} className="text-sm px-4 py-2.5 rounded-xl border border-red-300 text-red-600">❌ நிராகரி</button>
              </div>
            </div>
          ))}
          {pendingOrders.length === 0 && <p className="text-gray-500">புதிய ஆர்டர் விசாரணைகள் இல்லை.</p>}
        </div>
      )}

      {tab === "sales" && (
        <div className="space-y-3">
          {salesHistory.map((o) => (
            <div key={o._id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-leaf-900">{o.product?.name} × {o.quantity} {o.product?.unit}</p>
                <p className="text-sm text-gray-500">{o.customer?.name} · ₹{o.totalPrice}</p>
              </div>
              <span className={`badge ${o.status === "rejected" || o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-leaf-100 text-leaf-700"}`}>{o.status}</span>
            </div>
          ))}
          {salesHistory.length === 0 && <p className="text-gray-500">இன்னும் விற்பனை இல்லை.</p>}
        </div>
      )}
    </div>
  );
}
