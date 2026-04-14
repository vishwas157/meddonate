import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Scanner from "../components/Scanner";

function Dashboard() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 QR Scan auto-fill
  const handleScan = (scannedData) => {
    setFormData((prev) => ({
      ...prev,
      name: scannedData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await axios.post(
            "http://localhost:5000/api/medicines",
            {
              ...formData,
              location: {
                city: "User Location",
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Medicine donated successfully!");

          // Reset form
          setFormData({
            name: "",
            quantity: "",
            expiryDate: "",
            description: "",
          });

        } catch (err) {
          console.error(err);
          alert("Error donating medicine");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert("Please allow location access.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto py-20 space-y-10"
    >
      <h1 className="text-4xl font-bold text-center">
        Donate Medicine
      </h1>

      {/* 🔥 SCANNER */}
      <Scanner onScan={handleScan} />

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="glass glow-hover rounded-3xl p-10 space-y-6"
      >
        <input
          name="name"
          placeholder="Medicine Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          required
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="expiryDate"
          type="date"
          required
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="modern-btn w-full"
        >
          {loading ? "Donating..." : "Donate Medicine"}
        </button>
      </form>
    </motion.div>
  );
}

export default Dashboard;