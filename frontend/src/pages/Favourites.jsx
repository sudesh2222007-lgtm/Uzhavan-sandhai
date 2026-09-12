import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FarmerCard from "../components/FarmerCard";
import { useAuth } from "../context/AuthContext";

export default function Favourites() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    if (!user?.favouriteFarmers?.length) return;
    Promise.all(user.favouriteFarmers.map((id) => api.get(`/users/farmer/${id}`).then((r) => r.data.farmer)))
      .then(setFarmers)
      .catch(() => {});
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-6">❤️ பிடித்த விவசாயிகள்</h1>
      <div className="space-y-3">
        {farmers.map((f) => <FarmerCard key={f._id} farmer={f} />)}
        {farmers.length === 0 && <p className="text-gray-500">நீங்கள் இன்னும் விவசாயிகளை பிடித்தவை பட்டியலில் சேர்க்கவில்லை. பொருள் விவரங்கள் பக்கத்தில் "❤️" பொத்தானை பயன்படுத்தவும்.</p>}
      </div>
    </div>
  );
}
