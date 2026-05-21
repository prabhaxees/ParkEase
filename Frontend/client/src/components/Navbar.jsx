import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";

const getUserRole = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

function Navbar() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <nav className="app-nav">

      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="ParkEase Logo"
          className="h-12 w-auto object-contain"
        />

        <Link
          to="/zones"
          className="text-2xl font-bold tracking-tight"
        >
          ParkEase
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">

        <Link to="/zones" className="nav-link">
          Zones
        </Link>

        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        <Link to="/my-bookings" className="nav-link">
          My Bookings
        </Link>

        {userRole === "admin" && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="nav-action"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
