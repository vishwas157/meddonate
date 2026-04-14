import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

function Layout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Donate", path: "/dashboard", icon: <HeartHandshake size={20} /> },
    { name: "Nearby", path: "/map", icon: <MapPin size={20} /> },
    { name: "Admin", path: "/admin", icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] bg-blue-600 text-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-[55] top-0 left-0 h-full w-64
          bg-gradient-to-b from-blue-700 to-blue-900
          text-white p-6 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <h1 className="text-2xl font-bold mb-10 tracking-wide">
          MedDonate
        </h1>

        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-blue-700 font-semibold shadow-md"
                      : "hover:bg-blue-600"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full pt-28 px-6">
        {children}
      </main>

    </div>
  );
}

export default Layout;