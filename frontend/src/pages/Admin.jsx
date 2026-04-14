import { useEffect, useState } from "react";
import axios from "axios";
import { Package, CheckCircle, XCircle } from "lucide-react";

function Admin() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(
        "https://meddonate.onrender.com/api/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="text-center py-10 text-white">
        Loading admin stats...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <Package className="mb-3 text-blue-400" />
          <p className="text-gray-400 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <CheckCircle className="mb-3 text-green-400" />
          <p className="text-gray-400 text-sm">Available</p>
          <h2 className="text-2xl font-bold">{stats.available}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <CheckCircle className="mb-3 text-yellow-400" />
          <p className="text-gray-400 text-sm">Claimed</p>
          <h2 className="text-2xl font-bold">{stats.claimed}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <XCircle className="mb-3 text-red-400" />
          <p className="text-gray-400 text-sm">Expired</p>
          <h2 className="text-2xl font-bold">{stats.expired}</h2>
        </div>

      </div>
    </div>
  );
}

export default Admin;
