import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ EMAIL LOGIN (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        "https://meddonate.onrender.com/api/auth/login",
        formData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  // ✅ GOOGLE LOGIN (CORRECT)
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href =
      "https://meddonate.onrender.com/api/auth/google";
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex-col items-center justify-center hidden p-12 text-white md:flex bg-gradient-to-br from-blue-600 to-purple-700">
        <h1 className="mb-6 text-5xl font-extrabold tracking-wide">
          MedDonate
        </h1>
        <p className="max-w-md text-lg text-center text-blue-100">
          Reduce medicine waste. Help communities.
          Make healthcare accessible for everyone.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 bg-gray-100">
        <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-2xl">

          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>

          {/* EMAIL LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 p-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex items-center justify-center w-full gap-3 p-3 font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-60"
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

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 p-3 mt-5 text-red-600 bg-red-100 border border-red-300 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* REGISTER LINK */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;