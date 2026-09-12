import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [step, setStep] = useState(1); // 1 = enter phone, 2 = enter otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpCode, setDevOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDevMode, setOtpDevMode] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
    try {
      const res = await api.post("/auth/send-otp", { phone });
      setOtpDevMode(!!res.data.devMode);
      if (res.data.devOtp) {
        setDevOtpCode(res.data.devOtp);
        setOtp(res.data.devOtp); // Auto-fill for ultra smooth login access
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { phone, otp });
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      navigate(role === "farmer" ? "/farmer/dashboard" : role === "admin" ? "/admin" : "/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Aesthetic Background Accents */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-leaf-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-8 sm:p-10 shadow-2xl border border-white/80 bg-white/85">
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 inline-block">👨‍🌾</span>
          <h1 className="font-display text-3xl font-extrabold text-leaf-900">உழவன் சந்தை</h1>
          <p className="text-sm font-medium text-leaf-700 mt-1">உள்நுழைவு (Login)</p>
          <p className="text-xs text-gray-500 mt-1">உங்கள் மொபைல் எண் மூலம் எளிதாக உள்நுழையவும்</p>
        </div>

        {error && (
          <div className="text-red-700 text-sm mb-4 bg-red-50/90 border border-red-200 p-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                📱 மொபைல் எண் (Phone Number)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-500 font-medium text-sm">+91</span>
                <input
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  placeholder="9876543210"
                  className="input-field pl-12 text-lg font-medium tracking-wide shadow-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">10 இலக்க இந்திய கைபேசி எண்ணை பதிவிடவும்</p>
            </div>

            <button className="btn-primary w-full py-3 text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin text-lg">🌀</span>
                  <span>OTP அனுப்பப்படுகிறது...</span>
                </>
              ) : (
                <>
                  <span>OTP பெறுக (Get OTP)</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyAndLogin} className="space-y-5">
            {otpDevMode && devOtpCode && (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-center shadow-sm">
                <span className="badge bg-emerald-600 text-white mb-1">🔑 Dev Mode Instant Access</span>
                <p className="text-sm font-medium text-emerald-900">
                  உங்கள் OTP குறியீடு: <span className="text-xl font-extrabold text-emerald-700 tracking-wider ml-1">{devOtpCode}</span>
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">(தானாக நிரப்பப்பட்டுள்ளது / Auto-filled)</p>
              </div>
            )}

            <p className="text-sm text-gray-600 text-center">
              📱 <b>{phone}</b> எண்ணிற்கு OTP அனுப்பப்பட்டது.
            </p>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5 text-center">
                OTP குறியீட்டை உள்ளிடவும்
              </label>
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

            <button className="btn-primary w-full py-3 text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "சரிபார்க்கிறது..." : "உள்நுழைக (Verify & Login)"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-leaf-700 hover:text-leaf-900 hover:underline w-full text-center block pt-1"
            >
              ← மொபைல் எண்ணை மாற்ற
            </button>
          </form>
        )}

        <div className="border-t border-gray-200 mt-6 pt-5 text-center">
          <p className="text-sm text-gray-600">
            புதிய கணக்கு தொடங்கவேண்டுமா?{" "}
            <Link to="/register" className="text-leaf-700 font-bold hover:underline">
              இங்கே பதிவு செய்யவும் (Register)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
