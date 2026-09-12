import React, { useEffect, useState } from "react";
import api from "../api/axios";
import InfoCard from "../components/InfoCard";
import useGeolocation from "../hooks/useGeolocation";

export default function FarmerInfoCenter() {
  const { coords } = useGeolocation(true);
  const [weather, setWeather] = useState(null);
  const [prices, setPrices] = useState([]);
  const [news, setNews] = useState([]);
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    api.get("/info/weather", { params: coords || {} }).then((res) => setWeather(res.data.weather));
  }, [coords]);

  useEffect(() => {
    api.get("/info/market-prices").then((res) => setPrices(res.data.prices));
    api.get("/info/news").then((res) => setNews(res.data.news));
    api.get("/info/schemes").then((res) => setSchemes(res.data.schemes));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-1">விவசாய தகவல் மையம்</h1>
      <p className="text-gray-500 mb-8">வானிலை, சந்தை விலை, பயிர் ஆலோசனை மற்றும் மேலும் பல.</p>

      {weather && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <InfoCard icon="🌦" title="இன்றைய வானிலை">{weather.condition}</InfoCard>
          <InfoCard icon="🌡" title="வெப்பநிலை">{weather.temperature}°C</InfoCard>
          <InfoCard icon="☔" title="மழை வாய்ப்பு">{weather.rainChancePercent}%</InfoCard>
          <InfoCard icon="💨" title="காற்றின் வேகம்">{weather.windSpeedKmh} கி.மீ/ம</InfoCard>
          <InfoCard icon="💧" title="ஈரப்பதம்">{weather.humidity}%</InfoCard>
        </div>
      )}

      <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">📈 தினசரி சந்தை விலைகள்</h2>
      <div className="glass-card p-4 mb-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">பொருள்</th><th>சந்தை</th><th>குறைந்தபட்சம்</th><th>அதிகபட்சம்</th><th>சராசரி</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="py-2 font-medium">{p.productName}</td>
                <td>{p.market}</td>
                <td>₹{p.minPrice}</td>
                <td>₹{p.maxPrice}</td>
                <td className="font-semibold text-leaf-700">₹{p.avgPrice}</td>
              </tr>
            ))}
            {prices.length === 0 && <tr><td className="py-3 text-gray-500" colSpan={5}>விலை தகவல் இல்லை. (Run: npm run seed)</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">வழிகாட்டி &amp; ஆலோசனை</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <InfoCard icon="🌱" title="பருவகால பயிர் வழிகாட்டி">தற்போதைய பருவத்திற்கு ஏற்ற பயிர்களை தேர்ந்தெடுக்கவும்.</InfoCard>
        <InfoCard icon="🌾" title="பயிர் ஆலோசனை">உங்கள் பயிருக்கான சிறந்த நடைமுறைகள்.</InfoCard>
        <InfoCard icon="🐛" title="பூச்சி மற்றும் நோய் தகவல்">பொதுவான பூச்சிகள் மற்றும் கட்டுப்பாட்டு முறைகள்.</InfoCard>
        <InfoCard icon="🧪" title="உர வழிகாட்டி">சரியான உரமிடும் அட்டவணை.</InfoCard>
        <InfoCard icon="💧" title="பாசன குறிப்புகள்">நீர் சேமிப்பு நடைமுறைகள்.</InfoCard>
        <InfoCard icon="🌍" title="மண் ஆரோக்கியம்">மண் பரிசோதனை மற்றும் மேம்பாடு.</InfoCard>
        <InfoCard icon="📅" title="விவசாய நாட்காட்டி">விதைப்பு முதல் அறுவடை வரை.</InfoCard>
        <InfoCard icon="🌿" title="இயற்கை விவசாய குறிப்புகள்">வேதியியல் இல்லாத வேளாண்மை முறைகள்.</InfoCard>
        <InfoCard icon="🚜" title="உபகரண வாடகை">அருகிலுள்ள வாடகை மையங்கள்.</InfoCard>
        <InfoCard icon="🏪" title="அருகிலுள்ள விதை கடைகள்">உங்கள் பகுதியில் உள்ள கடைகள்.</InfoCard>
        <InfoCard icon="📞" title="விவசாய அலுவலர் தொடர்பு">📞 1800-XXX-XXXX</InfoCard>
      </div>

      <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">📰 விவசாய செய்திகள்</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {news.map((n) => (
          <div key={n._id} className="glass-card p-4">
            <h4 className="font-semibold text-leaf-900 mb-1">{n.title}</h4>
            <p className="text-sm text-gray-600">{n.content}</p>
          </div>
        ))}
        {news.length === 0 && <p className="text-gray-500">செய்திகள் இல்லை.</p>}
      </div>

      <h2 className="font-display text-xl font-bold text-leaf-900 mb-4">🏦 அரசு திட்டங்கள்</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {schemes.map((s) => (
          <div key={s._id} className="glass-card p-4">
            <h4 className="font-semibold text-leaf-900 mb-1">{s.title}</h4>
            <p className="text-sm text-gray-600 mb-1">{s.description}</p>
            <p className="text-xs text-gray-500">தகுதி: {s.eligibility}</p>
            {s.applyLink && <a href={s.applyLink} target="_blank" rel="noreferrer" className="text-sm text-leaf-600 hover:underline">விண்ணப்பிக்க →</a>}
          </div>
        ))}
        {schemes.length === 0 && <p className="text-gray-500">திட்டங்கள் இல்லை.</p>}
      </div>
    </div>
  );
}
