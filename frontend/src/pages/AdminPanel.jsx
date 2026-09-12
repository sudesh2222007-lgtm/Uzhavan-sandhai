import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPanel() {
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const load = () => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data.analytics));
    api.get("/admin/farmers/pending").then((res) => setPendingFarmers(res.data.farmers));
    api.get("/admin/customers").then((res) => setCustomers(res.data.customers));
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await api.patch(`/admin/farmers/${id}/approve`);
    load();
  };

  const toggleActive = async (id) => {
    await api.patch(`/admin/users/${id}/toggle-active`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-6">நிர்வாக பலகை</h1>

      <div className="flex gap-2 mb-8">
        {[["analytics", "பகுப்பாய்வு"], ["farmers", `விவசாயி ஒப்புதல் (${pendingFarmers.length})`], ["customers", "வாடிக்கையாளர்கள்"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl text-sm font-medium border ${tab === k ? "bg-leaf-600 text-white border-leaf-600" : "border-gray-300 text-gray-600"}`}>{l}</button>
        ))}
      </div>

      {tab === "analytics" && analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["👨‍🌾", analytics.totalFarmers, "விவசாயிகள்"],
            ["🧑‍🤝‍🧑", analytics.totalCustomers, "வாடிக்கையாளர்கள்"],
            ["🥬", analytics.totalProducts, "பொருட்கள்"],
            ["📦", analytics.totalOrders, "ஆர்டர்கள்"],
            ["💰", `₹${analytics.totalRevenue}`, "மொத்த வருவாய்"],
          ].map(([icon, val, label]) => (
            <div key={label} className="glass-card p-5 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xl font-bold text-leaf-900">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "farmers" && (
        <div className="space-y-3">
          {pendingFarmers.map((f) => (
            <div key={f._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-leaf-900">{f.name}</p>
                <p className="text-sm text-gray-500">📞 {f.phone} · 📍 {f.village}</p>
              </div>
              <button onClick={() => approve(f._id)} className="btn-primary text-sm">✅ ஒப்புதல்</button>
            </div>
          ))}
          {pendingFarmers.length === 0 && <p className="text-gray-500">ஒப்புதலுக்கு காத்திருக்கும் விவசாயிகள் இல்லை.</p>}
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-3">
          {customers.map((c) => (
            <div key={c._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-leaf-900">{c.name}</p>
                <p className="text-sm text-gray-500">📞 {c.phone}</p>
              </div>
              <button onClick={() => toggleActive(c._id)} className={`text-sm px-4 py-2 rounded-xl border ${c.isActive ? "border-red-300 text-red-600" : "border-leaf-300 text-leaf-700"}`}>
                {c.isActive ? "முடக்கு" : "செயல்படுத்து"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
