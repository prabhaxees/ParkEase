import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="app-main">
        <h1 className="page-title mb-8 text-4xl">
          Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/zones"
            className="card interactive-card p-6"
          >
            <h2 className="section-title mb-2 text-2xl">
              Find Parking
            </h2>
            <p className="muted">
              Select a zone and book an available slot.
            </p>
          </Link>

          <Link
            to="/my-bookings"
            className="card interactive-card p-6"
          >
            <h2 className="section-title mb-2 text-2xl">
              My Bookings
            </h2>
            <p className="muted">
              View the slots you have already booked.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
