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
    <div className="min-h-screen bg-[#fff5f7]">
      <Navbar />

      <main className="p-10">
        <h1 className="mb-8 text-4xl font-bold text-[#ba0c2f]">
          Admin Dashboard
        </h1>

        <form
          onSubmit={handleCreateZone}
          className="mb-10 grid gap-4 rounded-[30px] bg-white p-6 shadow-lg border border-[#f3d2d9] md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="text"
            placeholder="Zone name"
            className="rounded border p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="rounded border p-3"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button
            type="submit"
            className="rounded-2xl bg-[#ba0c2f] px-6 py-3 font-semibold text-white transition hover:bg-[#8a0a23]"
          >
            Add Zone
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone._id}
              className="overflow-hidden rounded-[30px] bg-white shadow-lg border border-[#f3d2d9]"
            >
              <img
                src={zone.imageUrl}
                alt={zone.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="mb-2 text-2xl font-semibold">
                  {zone.name}
                </h2>

                <p className="mb-4 text-sm font-medium text-[#6b414a]">
                  Status: {zone.status === "maintenance" ? "Maintenance" : "Active"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/map/${zone._id}`}
                    className="rounded-2xl bg-[#ba0c2f] px-4 py-2 font-semibold text-white transition hover:bg-[#8a0a23]"
                  >
                    Edit Slots
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleMaintenance(zone)}
                    className="rounded-2xl bg-[#8a0a23] px-4 py-2 font-semibold text-white transition hover:bg-[#66161f]"
                  >
                    {zone.status === "maintenance" ? "Set Active" : "Set Maintenance"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteZone(zone._id)}
                    className="rounded-2xl bg-[#ba0c2f] px-4 py-2 font-semibold text-white transition hover:bg-[#8a0a23]"
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
