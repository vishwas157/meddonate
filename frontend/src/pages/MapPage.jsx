import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Recenter map when position changes
function RecenterMap({ position }) {
  const map = useMap();
  map.setView(position, 14);
  return null;
}

function MapPage() {
  const [position, setPosition] = useState([23.0225, 72.5714]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const doctors = [
    { name: "City Hospital", coords: [23.025, 72.575] },
    { name: "Care Clinic", coords: [23.02, 72.568] },
    { name: "Apollo Center", coords: [23.03, 72.56] },
    { name: "Sunrise Hospital", coords: [23.015, 72.57] },
    { name: "Green Health Clinic", coords: [23.028, 72.58] },
  ];

  const ngos = [
    { name: "Health NGO Trust", coords: [23.018, 72.58] },
    { name: "Medicine Aid Foundation", coords: [23.03, 72.56] },
    { name: "Care India NGO", coords: [23.022, 72.565] },
    { name: "Life Support NGO", coords: [23.027, 72.573] },
  ];

  return (
    <div className="relative min-h-screen text-white space-y-6">

      {/* Header Section */}
      <div className="relative z-20">
        <h1 className="text-3xl font-bold">
          Nearby Doctors & NGOs
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mt-4">
          {["all", "doctors", "ngos"].map((btn) => (
            <button
              key={btn}
              onClick={() => setType(btn)}
              className={`px-4 py-2 rounded-lg transition ${
                type === btn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {btn.charAt(0).toUpperCase() + btn.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      {loading ? (
        <div className="h-[500px] flex items-center justify-center bg-gray-800 rounded-2xl">
          <p>Fetching your location...</p>
        </div>
      ) : (
        <div className="relative z-0">
          <MapContainer
            center={position}
            zoom={14}
            className="h-[500px] rounded-2xl shadow-2xl"
          >
            <RecenterMap position={position} />

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Marker */}
            <Marker position={position}>
              <Popup>
                <strong>You are here</strong>
              </Popup>
            </Marker>

            {/* Doctors */}
            {(type === "all" || type === "doctors") &&
              doctors.map((doc, index) => (
                <Marker key={`doc-${index}`} position={doc.coords}>
                  <Popup>
                    <div className="space-y-2">
                      <strong>{doc.name}</strong>
                      <p className="text-sm">
                        {calculateDistance(
                          position[0],
                          position[1],
                          doc.coords[0],
                          doc.coords[1]
                        )}{" "}
                        km away
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${doc.coords[0]},${doc.coords[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* NGOs */}
            {(type === "all" || type === "ngos") &&
              ngos.map((ngo, index) => (
                <Marker key={`ngo-${index}`} position={ngo.coords}>
                  <Popup>
                    <div className="space-y-2">
                      <strong>{ngo.name}</strong>
                      <p className="text-sm">
                        {calculateDistance(
                          position[0],
                          position[1],
                          ngo.coords[0],
                          ngo.coords[1]
                        )}{" "}
                        km away
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${ngo.coords[0]},${ngo.coords[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}

          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default MapPage;