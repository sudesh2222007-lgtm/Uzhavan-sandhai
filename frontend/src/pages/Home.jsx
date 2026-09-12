import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

const FAQS = [
  { q: "இந்த தளத்தில் பொருட்களை வாங்குவது எப்படி?", a: "பொருட்கள் பக்கத்திற்குச் சென்று, விரும்பிய பொருளைத் தேர்ந்தெடுத்து ஆர்டர் செய்யலாம்." },
  { q: "விவசாயியை நேரடியாக தொடர்பு கொள்ள முடியுமா?", a: "ஆம், ஒவ்வொரு பொருள் அட்டையிலும் WhatsApp / அழைப்பு பொத்தான் உள்ளது." },
  { q: "பணம் செலுத்துவது எப்படி?", a: "பணம் டெலிவரி நேரத்தில் (COD) அல்லது UPI மூலம் செலுத்தலாம்." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setFeatured(res.data.products.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Dynamic Aesthetic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-leaf-900 to-emerald-900 text-white rounded-b-3xl shadow-2xl">
        {/* Subtle decorative mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Text Content */}
          <div className="md:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs md:text-sm font-semibold tracking-wide backdrop-blur-md shadow-inner">
              <span>🌾 100% நேரடி பண்ணை பொருட்கள்</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>தரமான அறுவடை</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tight drop-shadow-md">
              உழவன் சந்தை
            </h1>
            
            <p className="text-xl sm:text-2xl font-semibold text-emerald-100 flex items-center gap-2">
              <span>மகிழ்ச்சியான விவசாயிகள்</span>
              <span className="text-amber-400">·</span>
              <span>புதிய பண்ணை காய்கறிகள்</span>
            </p>

            <p className="text-base sm:text-lg text-emerald-200/90 font-normal leading-relaxed max-w-xl">
              இடைத்தரகர்கள் இன்றி, உழைக்கும் நமது விவசாயிகளிடமிருந்து புதிய இயற்கை காய்கறி மற்றும் பழங்களை நேரடியாக உங்கள் வீட்டிற்குப் பெறுங்கள்!
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>🛒 புதிய பொருட்கள் பார்க்க</span>
                <span>→</span>
              </Link>

              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-base px-7 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>🚜 விவசாயியாக இணைய</span>
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/60 max-w-lg">
              <div>
                <p className="text-xl font-bold text-amber-400">0%</p>
                <p className="text-xs text-emerald-200/70 font-medium">நடுத்தர கமிஷன்</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-300">100%</p>
                <p className="text-xs text-emerald-200/70 font-medium">பண்ணை நன்னிலை</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-300">நேரடி</p>
                <p className="text-xs text-emerald-200/70 font-medium">விவசாயி தொடர்பு</p>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Image Banner */}
          <div className="md:col-span-5 relative">
            <div className="relative group">
              {/* Glow Behind Banner */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>

              {/* Main Banner Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-emerald-900">
                <img
                  src="/happy_farmer.jpg"
                  alt="Happy farmer with fresh farm produce"
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-xl shadow">
                    👨‍🌾
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">நேரடி விவசாய விளைபொருட்கள்</h4>
                    <p className="text-xs text-amber-300">உழவர் நலன் & வாடிக்கையாளர் மகிழ்ச்சி</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Product Categories */}
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-600 bg-leaf-100 px-3 py-1 rounded-full">
            பிரிவுகள் (Categories)
          </span>
          <h2 className="font-display text-3xl font-extrabold text-leaf-900 mt-2">
            புதிய பண்ணை வகைகள்
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {[
            ["🥬", "காய்கறி", "காய்கறிகள்"],
            ["🍎", "பழம்", "பழங்கள்"],
            ["🌾", "தானியம்", "தானியங்கள்"],
            ["🧺", "மற்றவை", "இயற்கை பொருட்கள்"],
          ].map(([icon, label, desc]) => (
            <Link
              key={label}
              to={`/products?category=${encodeURIComponent(label)}`}
              className="glass-card p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group border border-emerald-100"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{icon}</div>
              <div className="font-bold text-leaf-900 text-base group-hover:text-leaf-600 transition-colors">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-3 border-b border-gray-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Fresh Harvest
            </span>
            <h2 className="font-display text-3xl font-extrabold text-leaf-900 mt-1">
              சமீபத்திய புதிய பொருட்கள்
            </h2>
          </div>
          <Link
            to="/products"
            className="btn-secondary text-sm px-5 py-2.5 flex items-center gap-1 hover:bg-leaf-600 hover:text-white transition-all shadow-sm"
          >
            <span>அனைத்தையும் பார்க்க</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          {featured.length === 0 && (
            <EmptyState
              title="தற்போது புதிய பொருட்கள் இல்லை"
              message="விவசாயிகள் விரைவில் புதிய அறுவடையை பதிவேற்றுவார்கள். பின்னர் மீண்டும் பாருங்கள்!"
            />
          )}
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-gradient-to-r from-leaf-50 via-emerald-100/50 to-leaf-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-extrabold text-leaf-900">
              ஏன் உழவன் சந்தையை தேர்ந்தெடுக்க வேண்டும்?
            </h2>
            <p className="text-sm text-gray-600 mt-2">விவசாயிகளுக்கும் நுகர்வோருக்குமான சிறந்த தளம்</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["💰", "நியாயமான விலை", "நடுத்தரவரி இல்லாமல் 100% நேரடி விவசாயி விலை"],
              ["🌱", "புதிய அறுவடை", "பண்ணையிலிருந்து நேரடியாக புதிய பொருட்கள்"],
              ["🤝", "நேரடி தொடர்பு", "விவசாயிகளிடம் நேரடியாக போன்/வாட்ஸ்அப் மூலம் பேசலாம்"],
              ["📍", "அருகிலுள்ள விவசாயிகள்", "உங்கள் பகுதியிலுள்ள விவசாயிகளை எளிதில் கண்டறியலாம்"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="glass-card p-6 text-center hover:shadow-lg transition-shadow bg-white/90">
                <div className="text-4xl mb-4 bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">{icon}</div>
                <h4 className="font-bold text-lg text-leaf-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-3xl font-extrabold text-leaf-900 mb-8 text-center">
          அடிக்கடி கேட்கப்படும் கேள்விகள்
        </h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-card p-5 border border-emerald-100 group">
              <summary className="font-bold text-leaf-900 cursor-pointer text-base flex justify-between items-center">
                <span>{f.q}</span>
                <span className="text-leaf-600 text-xl font-bold group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
