import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const BASE_URL = "https://meddonate.onrender.com"; // ✅ FIX

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "donor",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        location: form.location,
        role: form.role,
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }

    setLoading(false);
  };

  // ✅ Google Signup FIX
  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">

      {/* LEFT */}
      <div className="flex-col items-center justify-center hidden p-12 text-white md:flex bg-gradient-to-br from-blue-600 to-purple-700">
        <h1 className="mb-6 text-5xl font-extrabold">Join MedDonate</h1>
        <p className="max-w-md text-center text-blue-100">
          Help reduce medicine waste and make healthcare accessible.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 bg-gray-100">
        <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-2xl">

          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input name="name" placeholder="Full Name" required value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg" />

            <input name="email" type="email" placeholder="Email" required
              value={form.email} onChange={handleChange}
              className="w-full p-3 border rounded-lg" />

            <input name="password" type="password" placeholder="Password" required
              value={form.password} onChange={handleChange}
              className="w-full p-3 border rounded-lg" />

            <input name="confirmPassword" type="password" placeholder="Confirm Password" required
              value={form.confirmPassword} onChange={handleChange}
              className="w-full p-3 border rounded-lg" />

            <input name="location" placeholder="City" required
              value={form.location} onChange={handleChange}
              className="w-full p-3 border rounded-lg" />

            <select name="role" value={form.role} onChange={handleChange}
              className="w-full p-3 border rounded-lg">
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </select>

            <button type="submit" disabled={loading}
              className="w-full p-3 text-white bg-blue-600 rounded-lg">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button onClick={handleGoogleSignup}
            className="w-full p-3 border rounded-lg">
            Continue with Google
          </button>

          {error && <p className="mt-3 text-red-500">{error}</p>}
          {success && <p className="mt-3 text-green-500">{success}</p>}

          <p className="mt-6 text-sm text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}