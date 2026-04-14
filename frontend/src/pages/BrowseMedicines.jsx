import { useEffect, useState } from "react";
import axios from "axios";
import MedicineCard from "../components/MedicineCard";
import { useLocation } from "../context/LocationContext";

function BrowseMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [view, setView] = useState("medicines");

  const [form, setForm] = useState({
    medicine: "",
    quantity: "",
    urgency: "normal",
  });

  const { location, calculateDistance } = useLocation();

  // ✅ BASE URL (production)
  const BASE_URL = "https://meddonate.onrender.com";

  // ================= FETCH MEDICINES =================
  const fetchMedicines = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/medicines`);

      let meds = data.medicines;

      if (location) {
        meds = meds.map((med) => {
          if (med.donor?.lat && med.donor?.lng) {
            const distance = calculateDistance(
              location.lat,
              location.lng,
              med.donor.lat,
              med.donor.lng
            );
            return { ...med, distance };
          }
          return med;
        });

        meds.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }

      setMedicines(meds);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  // ================= LOAD REQUIREMENTS =================
  const loadRequirements = () => {
    const data = JSON.parse(localStorage.getItem("requirements")) || [];
    setRequirements(data);
  };

  useEffect(() => {
    fetchMedicines();
    loadRequirements();
  }, [location]);

  // ================= CLAIM MEDICINE =================
  const handleClaim = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/medicines/${id}/claim`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Medicine claimed!");
      fetchMedicines();
    } catch (error) {
      alert("Claim failed");
    }
  };

  // ================= ADD REQUIREMENT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const newReq = {
      id: Date.now(),
      medicine: form.medicine,
      quantity: form.quantity,
      urgency: form.urgency,
      status: "open",
    };

    const updated = [newReq, ...requirements];

    localStorage.setItem("requirements", JSON.stringify(updated));
    setRequirements(updated);

    setForm({
      medicine: "",
      quantity: "",
      urgency: "normal",
    });
  };

  // ================= FULFILL =================
  const handleFulfill = (id) => {
    const updated = requirements.map((req) =>
      req.id === id ? { ...req, status: "fulfilled" } : req
    );

    localStorage.setItem("requirements", JSON.stringify(updated));
    setRequirements(updated);

    alert("Requirement fulfilled!");
  };

  return (
    <div className="max-w-6xl py-10 mx-auto text-white">

      {/* TOGGLE */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setView("medicines")}
          className={`px-5 py-2 rounded-lg ${
            view === "medicines" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Medicines
        </button>

        <button
          onClick={() => setView("requirements")}
          className={`px-5 py-2 rounded-lg ${
            view === "requirements" ? "bg-purple-600" : "bg-gray-700"
          }`}
        >
          Requirements
        </button>
      </div>

      {/* MEDICINES */}
      {view === "medicines" && (
        <div className="grid gap-6 md:grid-cols-3">
          {medicines.map((med) => (
            <MedicineCard
              key={med._id}
              name={med.name}
              quantity={med.quantity}
              expiryDate={med.expiryDate}
              donorName={med.donor?.name}
              location={med.donor?.location}
              distance={med.distance}
              onClaim={() => handleClaim(med._id)}
            />
          ))}
        </div>
      )}

      {/* REQUIREMENTS */}
      {view === "requirements" && (
        <div className="space-y-8">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 bg-gray-900 border border-gray-800 rounded-xl"
          >
            <h2 className="text-lg font-semibold">Post Requirement</h2>

            <input
              placeholder="Medicine Name"
              value={form.medicine}
              onChange={(e) =>
                setForm({ ...form, medicine: e.target.value })
              }
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />

            <select
              value={form.urgency}
              onChange={(e) =>
                setForm({ ...form, urgency: e.target.value })
              }
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">Urgent</option>
            </select>

            <button className="w-full px-5 py-2 bg-purple-600 rounded-lg">
              Submit Requirement
            </button>
          </form>

          {/* LIST */}
          <div className="grid gap-6 md:grid-cols-2">
            {requirements.length === 0 ? (
              <p className="text-gray-400">No requirements yet</p>
            ) : (
              requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <h3 className="text-lg font-semibold">
                    {req.medicine}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Quantity: {req.quantity}
                  </p>

                  <p className="text-sm text-gray-400 capitalize">
                    Urgency: {req.urgency}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${
                      req.status === "fulfilled"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {req.status}
                  </span>

                  {req.status !== "fulfilled" && (
                    <button
                      onClick={() => handleFulfill(req.id)}
                      className="w-full py-2 mt-4 bg-blue-600 rounded-lg"
                    >
                      Fulfill Requirement
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default BrowseMedicines;