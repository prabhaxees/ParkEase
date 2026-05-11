import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        ParkEase
      </h1>

      <div className="flex gap-6">

        <Link to="/zones">
          Zones
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;