import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [urgentReqs, setUrgentReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const faqs = [
    {
      question: "Is medicine sharing legal?",
      answer:
        "Yes. We only allow unopened, non-prescription medicines in compliance with local safety guidelines.",
    },
    {
      question: "How are medicines verified?",
      answer:
        "Our AI-based expiry validation system ensures medicines are safe before listing.",
    },
    {
      question: "Is MedDonate free to use?",
      answer:
        "Yes. MedDonate is completely free for donors, recipients, and NGOs.",
    },
    {
      question: "Who can join?",
      answer:
        "Individuals, NGOs, and verified donors can join the platform securely.",
    },
  ];

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/medicines");

        const meds = Array.isArray(res.data)
          ? res.data
          : res.data.medicines || [];

        setMedicines(meds.reverse().slice(0, 3));

        // 🔥 Load urgent requirements
        const reqs = JSON.parse(localStorage.getItem("requirements")) || [];

        const urgent = reqs.filter(
          (r) => r.urgency === "high" && r.status !== "fulfilled"
        );

        setUrgentReqs(urgent.slice(0, 3));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white">

      {/* HERO */}
      <section className="flex flex-col justify-center min-h-screen px-10 pt-32">
        <h1 className="mb-6 text-6xl font-bold leading-tight">
          Share Medicines.
          <br />
          <span className="text-purple-400">Save Lives.</span>
        </h1>

        <p className="max-w-2xl mb-8 text-lg text-gray-200">
          MedDonate connects verified donors with NGOs and recipients nearby.
          Reduce medicine waste, prevent expiry loss, and make healthcare
          accessible for everyone.
        </p>

        <div className="flex gap-6">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-3 font-semibold transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
          >
            Donate Now
          </button>

          <button
            onClick={() => (window.location.href = "/browse")}
            className="px-6 py-3 transition border border-white rounded-lg hover:bg-white/10"
          >
            Find Medicines
          </button>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="px-10 py-24 bg-black/30">
        <h2 className="mb-12 text-4xl font-bold text-center">
          The Problem We Solve
        </h2>

        <div className="grid gap-10 text-center md:grid-cols-3">
          <div>
            <h3 className="text-5xl font-bold text-purple-400">₹500Cr+</h3>
            <p className="mt-4 text-gray-300">
              Worth medicines wasted annually in India
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-blue-400">30%</h3>
            <p className="mt-4 text-gray-300">
              Medicines expire before usage
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-pink-400">Millions</h3>
            <p className="mt-4 text-gray-300">
              People lack access to essential medication
            </p>
          </div>
        </div>
      </section>

      {/* RECENT MEDICINES */}
      <section className="px-10 py-24">
        <h2 className="mb-12 text-4xl font-bold text-center">
          Recently Donated Medicines
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading medicines...</p>
        ) : medicines.length === 0 ? (
          <p className="text-center text-gray-400">
            No medicines donated yet.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {medicines.map((med) => (
              <div
                key={med._id}
                className="p-6 transition bg-white/10 rounded-xl hover:bg-white/20"
              >
                <h3 className="mb-2 text-xl font-semibold">
                  {med.name}
                </h3>

                <p className="text-gray-300">
                  Quantity: {med.quantity}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Expiry:{" "}
                  {med.expiryDate
                    ? new Date(med.expiryDate).toLocaleDateString()
                    : "Not specified"}
                </p>

                <button
                  onClick={() => (window.location.href = "/browse")}
                  className="px-4 py-2 mt-4 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🚨 URGENT REQUIREMENTS */}
      <section className="px-10 py-24 bg-black/30">
        <h2 className="mb-12 text-4xl font-bold text-center text-red-400">
          Urgently Required Medicines
        </h2>

        {urgentReqs.length === 0 ? (
          <p className="text-center text-gray-400">
            No urgent requirements right now.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {urgentReqs.map((req) => (
              <div
                key={req.id}
                className="p-6 transition border border-red-500 bg-white/10 rounded-xl hover:bg-white/20"
              >
                <h3 className="mb-2 text-xl font-semibold text-red-400">
                  {req.medicine}
                </h3>

                <p className="text-gray-300">
                  Quantity: {req.quantity}
                </p>

                <p className="mt-1 text-sm text-red-300">
                  🚨 Urgent Requirement
                </p>

                <button
                  onClick={() => (window.location.href = "/browse")}
                  className="w-full px-4 py-2 mt-4 text-sm bg-red-600 rounded-lg"
                >
                  Help Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-24 bg-black/30">
        <h2 className="mb-12 text-4xl font-bold text-center">
          How MedDonate Works
        </h2>

        <div className="grid gap-10 text-center md:grid-cols-4">
          {[
            "Register & Verify",
            "List or Claim Medicine",
            "AI Expiry Validation",
            "Location-Based Matching",
          ].map((step, index) => (
            <div key={index} className="p-6 bg-white/10 rounded-xl">
              <h3 className="text-xl font-semibold">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 py-24">
        <h2 className="mb-12 text-4xl font-bold text-center">FAQ</h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 bg-white/10 rounded-xl">
              <button
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
                className="w-full font-semibold text-left"
              >
                {faq.question}
              </button>

              {openFAQ === index && (
                <p className="mt-3 text-gray-300">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-400 bg-black/40">
        © 2026 MedDonate. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;