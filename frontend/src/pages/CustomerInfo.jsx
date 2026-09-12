import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/InfoCard";

export default function CustomerInfo() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-1">வாடிக்கையாளர் தகவல்</h1>
      <p className="text-gray-500 mb-8">புதிய பொருட்கள், ஆரோக்கிய குறிப்புகள் மற்றும் மேலும் பல.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/products"><InfoCard icon="🥬" title="இன்று அறுவடை செய்த பொருட்கள்">இன்று அறுவடை செய்யப்பட்ட புதிய பொருட்களை பார்க்க.</InfoCard></Link>
        <Link to="/products?seasonal=true"><InfoCard icon="🌾" title="பருவகால பொருட்கள்">தற்போதைய பருவத்திற்கு ஏற்ற பொருட்கள்.</InfoCard></Link>
        <InfoCard icon="🥗" title="ஆரோக்கிய உணவு குறிப்புகள்">அன்றாட உணவில் புதிய காய்கறிகளை சேர்த்துக் கொள்ளுங்கள்.</InfoCard>
        <InfoCard icon="🍲" title="எளிய ஆரோக்கிய சமையல் குறிப்புகள்">பருவகால காய்கறிகளைக் கொண்டு சுவையான உணவுகள்.</InfoCard>
        <InfoCard icon="📈" title="தினசரி விலை ஒப்பீடு">சந்தை விலையுடன் ஒப்பிட்டு சிறந்த விலையில் வாங்குங்கள்.</InfoCard>
        <InfoCard icon="💡" title="சேமிப்பு குறிப்புகள்">பழங்கள் மற்றும் காய்கறிகளை நீண்ட நாள் தாஜாவாக வைக்கும் முறைகள்.</InfoCard>
        <InfoCard icon="🌱" title="இயற்கை பொருட்களின் நன்மைகள்">ரசாயனம் இல்லாத உணவின் ஆரோக்கிய பலன்கள்.</InfoCard>
        <InfoCard icon="📅" title="பருவகால வாங்கும் வழிகாட்டி">எந்த மாதத்தில் என்ன பொருள் சிறந்தது என்பதை அறியுங்கள்.</InfoCard>
        <InfoCard icon="🚚" title="டெலிவரி கிடைக்குமா">ஒவ்வொரு பொருள் பக்கத்திலும் டெலிவரி விவரங்களைப் பார்க்கலாம்.</InfoCard>
        <Link to="/favourites"><InfoCard icon="❤️" title="பிடித்த விவசாயிகள்">உங்கள் பிடித்த விவசாயிகளை ஒரே இடத்தில் காணுங்கள்.</InfoCard></Link>
        <InfoCard icon="⭐" title="மதிப்பீடுகள் & மதிப்புரைகள்">மற்ற வாடிக்கையாளர்களின் கருத்துக்களைப் படியுங்கள்.</InfoCard>
        <Link to="/orders"><InfoCard icon="🔔" title="புதிய அறுவடை அறிவிப்புகள்">உங்கள் பிடித்த விவசாயிகளிடமிருந்து புதிய பொருட்கள் வந்தால் அறிவிப்பு பெறுங்கள்.</InfoCard></Link>
        <InfoCard icon="❓" title="உதவி & ஆதரவு">📞 1800-XXX-XXXX / support@uzhavansandhai.in</InfoCard>
      </div>
    </div>
  );
}
