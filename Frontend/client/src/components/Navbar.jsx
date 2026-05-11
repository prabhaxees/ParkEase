import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <nav className="bg-blue-600 text-white px-8 py-4 flex items-center justify-between">

      <Link
        to="/zones"
        className="text-2xl font-bold"
      >
        ParkEase
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/zones">
          Zones
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/my-bookings">
          My Bookings
        </Link>

        <Link to="/admin">
          Admin
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-white px-3 py-1 text-sm font-semibold text-blue-600"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
