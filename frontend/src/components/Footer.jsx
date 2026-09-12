import React from "react";

export default function Footer() {
  return (
    <footer className="bg-leaf-900 text-leaf-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-extrabold text-xl mb-2">🌾 உழவன் சந்தை</h3>
          <p className="text-leaf-100/80 text-sm">விவசாயியிடமிருந்து நேரடியாக உங்கள் வீட்டிற்கு!</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">விரைவு இணைப்புகள்</h4>
          <ul className="space-y-1 text-sm text-leaf-100/80">
            <li>பொருட்கள்</li>
            <li>அருகிலுள்ள விவசாயிகள்</li>
            <li>எங்களை பற்றி</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">தொடர்பு</h4>
          <p className="text-sm text-leaf-100/80">📞 1800-XXX-XXXX (விவசாய அலுவலர்)</p>
        </div>
      </div>
      <div className="text-center text-xs text-leaf-100/60 pb-6">© {new Date().getFullYear()} Uzhavan Sandhai. All rights reserved.</div>
    </footer>
  );
}
