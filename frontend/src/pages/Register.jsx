import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

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

  // ✅ Prevent access if already logged in
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
      await axios.post("http://localhost:5000/api/auth/register", {
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

  // ✅ Google Signup (Backend OAuth)
  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
          Join MedDonate
        </h1>
        <p className="text-blue-100 text-center max-w-md">
          Help reduce medicine waste and make healthcare accessible
          to those who need it most.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100 px-6">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="location"
              placeholder="City"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-100 border border-red-300 text-red-600 p-3 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 flex items-center gap-2 bg-green-100 border border-green-300 text-green-600 p-3 rounded-lg">
              <CheckCircle size={18} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}