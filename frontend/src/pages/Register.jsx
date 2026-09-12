import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import useGeolocation from "../hooks/useGeolocation";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", village: "" });
  const [otp, setOtp] = useState("");
  const [devOtpCode, setDevOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDevMode, setOtpDevMode] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { coords, error: geoError, loading: geoLoading, request: requestLocation } = useGeolocation(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Fallback to default Tamil Nadu coordinates (Chennai / Madurai area) if GPS permission is skipped
  const effectiveCoords = coords || { lat: 13.0827, lng: 80.2707 };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { phone: form.phone });
      setOtpDevMode(!!res.data.devMode);
      if (res.data.devOtp) {
        setDevOtpCode(res.data.devOtp);
        setOtp(res.data.devOtp);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        otp,
        role,
        ...(role === "farmer"
          ? { village: form.village || "நமது கிராமம்", farmLocation: effectiveCoords }
          : { currentLocation: effectiveCoords }),
      };
      const res = await api.post("/auth/register", payload);
      login(res.data.token, res.data.user);
      navigate(role === "farmer" ? "/farmer/dashboard" : "/products");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-leaf-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-8 sm:p-10 shadow-2xl border border-white/80 bg-white/85">
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 inline-block">🌾</span>
          <h1 className="font-display text-3xl font-extrabold text-leaf-900">உழவன் சந்தை</h1>
          <p className="text-sm font-medium text-leaf-700 mt-1">புதிய கணக்கு உருவாக்குதல்</p>
        </div>

        {/* Role Switcher */}
        <div className="flex gap-2 mb-6 p-1.5 bg-leaf-50 rounded-2xl border border-leaf-200">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
              role === "customer"
                ? "bg-leaf-600 text-white shadow-md"
                : "text-gray-600 hover:text-leaf-800"
            }`}
          >
            <span>🛒</span>
            <span>வாடிக்கையாளர் (Buyer)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
              role === "farmer"
                ? "bg-leaf-600 text-white shadow-md"
                : "text-gray-600 hover:text-leaf-800"
            }`}
          >
            <span>🚜</span>
            <span>விவசாயி (Farmer)</span>
          </button>
        </div>

        {error && (
          <div className="text-red-700 text-sm mb-4 bg-red-50/90 border border-red-200 p-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">முழு பெயர் (Full Name)</label>
              <input
                required
                placeholder="எ.கா. சுரேஷ் குமார்"
                className="input-field shadow-sm"
                value={form.name}
                onChange={update("name")}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">மொபைல் எண் (Phone Number)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-500 font-medium text-sm">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  placeholder="9876543210"
                  className="input-field pl-12 shadow-sm font-medium"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                />
              </div>
            </div>

            {role === "farmer" && (
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">ஊர் / கிராமம் (Village)</label>
                <input
                  required
                  placeholder="எ.கா. பொள்ளாச்சி"
                  className="input-field shadow-sm"
                  value={form.village}
                  onChange={update("village")}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                📍 {role === "farmer" ? "பண்ணை இருப்பிடம் (Farm GPS)" : "இருப்பிடம் (Location GPS)"}
              </label>
              <button
                type="button"
                onClick={requestLocation}
                className="btn-secondary w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5"
              >
                {geoLoading ? (
                  "கண்டுபிடிக்கிறது..."
                ) : coords ? (
                  <span className="text-emerald-700">✅ location: {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}</span>
                ) : (
                  "📍 எனது இருப்பிடத்தை கண்டறி (Detect Location)"
                )}
              </button>
              {!coords && (
                <p className="text-[11px] text-gray-400 mt-1 text-center">
                  (கண்டறியாவிட்டாலும் இயல்புநிலை இருப்பிடம் பயன்படுத்தப்படும்)
                </p>
              )}
            </div>

            <button className="btn-primary w-full py-3 font-bold shadow-md transition-all mt-2" disabled={loading}>
              {loading ? "அனுப்பப்படுகிறது..." : "OTP பெறுக (Get OTP)"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyAndRegister} className="space-y-4">
            {otpDevMode && devOtpCode && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-center">
                <span className="badge bg-emerald-600 text-white mb-1">🔑 Instant Registration OTP</span>
                <p className="text-sm font-medium text-emerald-900">
                  OTP Code: <span className="text-xl font-extrabold text-emerald-700 ml-1">{devOtpCode}</span>
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1 text-center">OTP உள்ளிடவும்</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="0000"
                className="input-field text-center text-2xl font-extrabold tracking-widest py-3 text-leaf-800 bg-leaf-50/50 border-leaf-300"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button className="btn-primary w-full py-3 font-bold shadow-md" disabled={loading}>
              {loading ? "உருவாக்குகிறது..." : "கணக்கு தொடங்குக (Complete Register)"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-leaf-700 hover:underline w-full text-center block">
              ← பின் செல்ல
            </button>
          </form>
        )}

        <div className="border-t border-gray-200 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-600">
            ஏற்கனவே கணக்கு உள்ளதா?{" "}
            <Link to="/login" className="text-leaf-700 font-bold hover:underline">
              உள்நுழைக (Login)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
