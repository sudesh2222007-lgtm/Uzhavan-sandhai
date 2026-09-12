// Haversine formula: great-circle distance between two GPS points, in km.
// Used instead of a paid Google Distance Matrix call for "nearby farmers" filtering.
// "Get Directions" still deep-links out to Google Maps on the frontend.
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  if ([lat1, lng1, lat2, lng2].some((v) => v === undefined || v === null)) return null;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // rounded to 1 decimal
};

module.exports = { getDistanceKm };
