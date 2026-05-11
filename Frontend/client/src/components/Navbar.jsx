import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <nav className="bg-[#ba0c2f] text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">

      <div className="flex items-center gap-3">
  <img
    src={logo}
    alt="ParkEase Logo"
    className="h-14 w-auto object-contain"
  />

  <Link
    to="/zones"
    className="text-2xl font-bold tracking-tight"
  >
    ParkEase
  </Link>
</div>

      <div className="flex flex-wrap items-center gap-4">

        <Link to="/zones" className="text-sm font-medium hover:text-[#f7d9e0]">
          Zones
        </Link>

        <Link to="/dashboard" className="text-sm font-medium hover:text-[#f7d9e0]">
          Dashboard
        </Link>

        <Link to="/my-bookings" className="text-sm font-medium hover:text-[#f7d9e0]">
          My Bookings
        </Link>

        <Link to="/admin" className="text-sm font-medium hover:text-[#f7d9e0]">
          Admin
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-white px-3 py-1 text-sm font-semibold text-[#ba0c2f] shadow-sm transition hover:bg-[#f7d9e0]"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
