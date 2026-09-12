import { useEffect, useState } from "react";

// Wraps the browser Geolocation API. Returns { coords, error, loading }.
export default function useGeolocation(autoRequest = true) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(autoRequest);

  const request = () => {
    if (!navigator.geolocation) {
      setError("இந்த உலாவி இருப்பிடத்தை ஆதரிக்கவில்லை");
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message || "இருப்பிடத்தை பெற முடியவில்லை");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (autoRequest) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { coords, error, loading, request };
}
