import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decodedUser));

        navigate("/profile");
      } catch (error) {
        console.error("Invalid user data");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-black text-white">
      <div className="flex items-center gap-3 text-lg">
        <Loader2 className="animate-spin" />
        Logging you in...
      </div>
    </div>
  );
}

export default GoogleSuccess;