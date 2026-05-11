import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <Navbar />

      <main className="p-10">
        <h1 className="mb-8 text-4xl font-bold text-[#ba0c2f]">
          Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/zones"
            className="rounded-3xl bg-white p-6 shadow-lg border border-[#f3d2d9] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              Find Parking
            </h2>
            <p className="text-[#6b414a]">
              Select a zone and book an available slot.
            </p>
          </Link>

          <Link
            to="/my-bookings"
            className="rounded-3xl bg-white p-6 shadow-lg border border-[#f3d2d9] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              My Bookings
            </h2>
            <p className="text-[#6b414a]">
              View the slots you have already booked.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
