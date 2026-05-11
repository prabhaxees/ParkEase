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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-10">
        <h1 className="mb-8 text-4xl font-bold">
          Admin Dashboard
        </h1>

        <form
          onSubmit={handleCreateZone}
          className="mb-10 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-[1fr_1fr_auto]"
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
            className="rounded bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Add Zone
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-3">
          {zones.map((zone) => (
            <div
              key={zone._id}
              className="overflow-hidden rounded-xl bg-white shadow"
            >
              <img
                src={zone.imageUrl}
                alt={zone.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="mb-4 text-2xl font-semibold">
                  {zone.name}
                </h2>

                <Link
                  to={`/admin/map/${zone._id}`}
                  className="inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                  Edit Slots
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
