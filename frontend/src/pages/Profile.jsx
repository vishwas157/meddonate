import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Mail, User } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/protected",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(data.user);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen px-6 py-24 text-white bg-gray-900">

      <div className="grid gap-6 mx-auto max-w-7xl md:grid-cols-4">

        {/* SIDEBAR */}
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl">

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 text-xl font-bold bg-blue-600 rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-3 font-semibold">{firstName}</h2>
            <p className="text-sm text-gray-400 capitalize">{user.role}</p>
          </div>

          <div className="space-y-2">
            {["overview", "orders", "activity", "invoices"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg capitalize transition ${
                  activeTab === tab
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <div className="space-y-6 md:col-span-3">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <div className="flex items-center gap-4 p-6 bg-gray-800 border border-gray-700 rounded-2xl">
                <User />
                <div>
                  <h2 className="font-semibold">{user.name}</h2>
                  <p className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail size={14} /> {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card title="Donations" value="12" />
                <Card title="Claims" value="4" />
                <Card title="Lives" value="23" />
                <Card title="Trust" value="92%" />
              </div>
            </>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && <Orders />}

          {/* ACTIVITY */}
          {activeTab === "activity" && <Activity />}

          {/* INVOICES */}
          {activeTab === "invoices" && <Invoices />}

        </div>
      </div>
    </div>
  );
}

export default Profile;



// ================= SMALL CARD =================
function Card({ title, value }) {
  return (
    <div className="p-4 text-center bg-gray-800 border border-gray-700 rounded-xl">
      <h2 className="text-xl font-bold text-blue-400">{value}</h2>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}



// ================= ORDERS =================
function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("donations")) || [];
    setOrders(data);
  }, []);

  if (!orders.length) {
    return <p className="text-gray-400">No donations yet</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {orders.map((item, i) => (
        <div key={i} className="p-5 bg-gray-800 border border-gray-700 rounded-xl">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
          <p className="text-sm text-gray-400">Expiry: {item.expiry}</p>
        </div>
      ))}
    </div>
  );
}



// ================= ACTIVITY =================
function Activity() {
  const data = [
    "Donated Paracetamol",
    "Claimed Insulin",
    "Updated Profile",
  ];

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          {item}
        </div>
      ))}
    </div>
  );
}



// ================= INVOICES =================
function Invoices() {
  const invoices = [
    { id: "INV001", status: "Completed" },
    { id: "INV002", status: "Pending" },
  ];

  return (
    <div className="space-y-3">
      {invoices.map((inv, i) => (
        <div
          key={i}
          className="flex justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg"
        >
          <span>{inv.id}</span>
          <span
            className={`text-sm ${
              inv.status === "Completed"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {inv.status}
          </span>
        </div>
      ))}
    </div>
  );
}