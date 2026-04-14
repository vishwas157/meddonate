import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getFirstName = (name) => name?.split(" ")[0];

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-lg"
              : "bg-gradient-to-r from-blue-900 to-purple-900"
          }
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="MedDonate Logo" className="w-auto h-12" />
            <span className="hidden text-2xl font-bold text-white sm:block">
              MedDonate
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 font-medium text-white">

            <Link to="/" className="transition hover:text-blue-400">
              Home
            </Link>

            <Link to="/dashboard" className="transition hover:text-blue-400">
              Donate
            </Link>

            <Link to="/browse" className="transition hover:text-blue-400">
              Browse
            </Link>

            <Link to="/map" className="transition hover:text-blue-400">
              Nearby
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 transition hover:text-purple-400"
                >
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold bg-blue-500 rounded-full">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="hidden sm:block">
                    {getFirstName(user.name)}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-[90px]" />
    </>
  );
}

export default Navbar;