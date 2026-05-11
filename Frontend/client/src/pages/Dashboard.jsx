import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-10">
        <h1 className="mb-8 text-4xl font-bold">
          Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/zones"
            className="rounded-xl bg-white p-6 shadow transition hover:scale-105"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              Find Parking
            </h2>
            <p className="text-gray-600">
              Select a zone and book an available slot.
            </p>
          </Link>

          <Link
            to="/my-bookings"
            className="rounded-xl bg-white p-6 shadow transition hover:scale-105"
          >
            <h2 className="mb-2 text-2xl font-semibold">
              My Bookings
            </h2>
            <p className="text-gray-600">
              View the slots you have already booked.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
