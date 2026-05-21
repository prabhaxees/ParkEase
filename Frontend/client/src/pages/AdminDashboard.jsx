import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [zones, setZones] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await API.get("/zones");

        setZones(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchZones();
  }, []);

  const handleCreateZone = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a zone image");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("image", image);

    try {
      const res = await API.post("/zones", data);

      setZones([res.data, ...zones]);
      setName("");
      setImage(null);
      e.target.reset();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not create zone");
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm("Delete this zone and all slots/bookings?")) {
      return;
    }

    try {
      await API.delete(`/zones/${zoneId}`);
      setZones(zones.filter((zone) => zone._id !== zoneId));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not delete zone");
    }
  };

  const handleToggleMaintenance = async (zone) => {
    const newStatus = zone.status === "maintenance" ? "active" : "maintenance";

    try {
      const res = await API.put(`/zones/${zone._id}`, { status: newStatus });
      setZones(zones.map((item) => (item._id === zone._id ? res.data : item)));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not update zone status");
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="app-main">
        <h1 className="page-title mb-8 text-4xl">
          Admin Dashboard
        </h1>

        <form
          onSubmit={handleCreateZone}
          className="card mb-10 grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="text"
            placeholder="Zone name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="field"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button
            type="submit"
            className="btn-primary px-6"
          >
            Add Zone
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone._id}
              className="card zone-card interactive-card overflow-hidden"
            >
              <img
                src={zone.imageUrl}
                alt={zone.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="section-title mb-2 text-2xl">
                  {zone.name}
                </h2>

                <p className="muted mb-4 text-sm font-bold">
                  Status: {zone.status === "maintenance" ? "Maintenance" : "Active"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/map/${zone._id}`}
                    className="btn-primary"
                  >
                    Edit Slots
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleMaintenance(zone)}
                    className="btn-secondary"
                  >
                    {zone.status === "maintenance" ? "Set Active" : "Set Maintenance"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteZone(zone._id)}
                    className="btn-danger"
                  >
                    Delete Zone
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
