import { useMemo } from "react";
import { CalendarDays, MapPin, User, Package } from "lucide-react";

function MedicineCard({
  name,
  quantity,
  expiryDate,
  donorName,
  location,
  distance,
  onClaim,
}) {
  const expiryInfo = useMemo(() => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Expired",
        color: "bg-red-800",
        days: diffDays,
      };
    }

    if (diffDays <= 7) {
      return {
        text: "Critical",
        color: "bg-red-600",
        days: diffDays,
      };
    }

    if (diffDays <= 30) {
      return {
        text: "Expiring Soon",
        color: "bg-orange-500",
        days: diffDays,
      };
    }

    if (diffDays <= 90) {
      return {
        text: "Moderate",
        color: "bg-blue-500",
        days: diffDays,
      };
    }

    return {
      text: "Safe",
      color: "bg-green-600",
      days: diffDays,
    };
  }, [expiryDate]);

  // Progress percentage (based on 180 days lifespan assumption)
  const progress = Math.min(
    100,
    Math.max(0, (expiryInfo.days / 180) * 100)
  );

  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-all duration-300 border border-gray-800">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <span
          className={`text-xs px-3 py-1 rounded-full ${expiryInfo.color}`}
        >
          {expiryInfo.text}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <Package size={16} />
        <span>Quantity: {quantity}</span>
      </div>

      {/* Expiry */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
        <CalendarDays size={16} />
        <span>
          Expiry: {new Date(expiryDate).toDateString()}
        </span>
      </div>

      {/* Days Remaining */}
      {expiryInfo.days >= 0 && (
        <p className="text-xs text-gray-400 mb-3">
          {expiryInfo.days} days remaining
        </p>
      )}

      {/* Progress Bar */}
      {expiryInfo.days >= 0 && (
        <div className="w-full bg-gray-700 h-2 rounded-full mb-4">
          <div
            className={`${expiryInfo.color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Donor */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <User size={16} />
        <span>Donor: {donorName}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <MapPin size={16} />
        <span>{location?.city || "Pickup location"}</span>
        {distance && (
          <span className="ml-auto text-xs bg-blue-700 px-2 py-1 rounded-full">
            {distance} km away
          </span>
        )}
      </div>

      {/* Claim Button */}
      <button
        onClick={onClaim}
        disabled={expiryInfo.text === "Expired"}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2 rounded-lg font-semibold transition-all duration-200"
      >
        {expiryInfo.text === "Expired"
          ? "Expired"
          : "Claim Medicine"}
      </button>
    </div>
  );
}

export default MedicineCard;