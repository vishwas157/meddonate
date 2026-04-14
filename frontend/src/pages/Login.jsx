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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/profile"); // ✅ Redirect to profile
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
          MedDonate
        </h1>
        <p className="text-lg text-blue-100 max-w-md text-center">
          Reduce medicine waste. Help communities.
          Make healthcare accessible for everyone.
        </p>
      </div>

      <div className="flex items-center justify-center bg-gray-100 px-6">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">

          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Welcome Back
          </h2>

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
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
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

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
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

          {error && (
            <div className="mt-5 flex items-center gap-2 bg-red-100 border border-red-300 text-red-600 p-3 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;