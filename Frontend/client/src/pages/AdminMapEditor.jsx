import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";
import Navbar from "../components/Navbar";

const SLOT_TYPES = [
  { value: "default", label: "Default" },
  { value: "faculty", label: "Faculty only" },
  { value: "parent", label: "Parent only" }
];

function AdminMapEditor() {

  const { zoneId } = useParams();

  const [zone, setZone] = useState(null);

  const [slots, setSlots] = useState([]);

  const [newSlotType, setNewSlotType] = useState("default");

  useEffect(() => {

    const fetchZone = async () => {

      try {

        const res = await API.get("/zones");

        const foundZone = res.data.find(
          (z) => z._id === zoneId
        );

        setZone(foundZone);

      } catch (error) {

        console.log(error);

      }
    };

    const fetchSlots = async () => {

      try {

        const res = await API.get(`/slots/${zoneId}`);

        setSlots(res.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchZone();

    fetchSlots();

  }, [zoneId]);

  const handleMapClick = async (e) => {
    if (zone.status === "maintenance") {
      alert("Cannot add slots while this zone is in maintenance mode.");
      return;
    }

    const x = e.nativeEvent.offsetX;

    const y = e.nativeEvent.offsetY;

    const slotData = {

      slotNumber: `S${slots.length + 1}`,

      zoneId,

      x,

      y,

      accessType: newSlotType

    };

    try {

      const res = await API.post(
        "/slots",
        slotData
      );

      setSlots([...slots, res.data]);

    } catch (error) {

      console.log(error);

    }
  };

  const handleSlotTypeChange = async (slotId, accessType) => {
    try {
      const res = await API.put(`/slots/${slotId}`, { accessType });

      setSlots(
        slots.map((slot) =>
          slot._id === slotId
            ? { ...slot, accessType: res.data.accessType }
            : slot
        )
      );
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not update slot type");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Delete this slot?")) {
      return;
    }

    try {
      await API.delete(`/slots/${slotId}`);
      setSlots(slots.filter((slot) => slot._id !== slotId));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not delete slot");
    }
  };

  if (!zone) {

    return (
      <h1 className="text-2xl text-center mt-10">
        Loading...
      </h1>
    );
  }

  return (

    <div className="min-h-screen bg-[#fff5f7]">

      <Navbar />

      <main className="p-10">

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold text-[#ba0c2f]">
            {zone.name}
          </h1>

          {zone.status === "maintenance" && (
            <span className="rounded-full bg-[#f7d9e0] px-3 py-1 text-sm font-semibold text-[#8a0a23]">
              Maintenance Mode
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label
            htmlFor="newSlotType"
            className="text-sm font-semibold text-[#3b1a20]"
          >
            New slot type
          </label>

          <select
            id="newSlotType"
            value={newSlotType}
            onChange={(e) => setNewSlotType(e.target.value)}
            className="rounded-xl border border-[#f3d2d9] bg-white px-3 py-2 text-sm text-[#3b1a20] focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
          >
            {SLOT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-fit">

          <img
            src={zone.imageUrl}
            alt={zone.name}
            onClick={handleMapClick}
            className="rounded-xl shadow-lg max-w-full cursor-crosshair"
          />

          {slots.map((slot) => (

            <div
              key={slot._id}
              className={`absolute px-2 py-1 rounded-full text-xs font-bold text-white
              ${slot.status !== "available"
                ? "bg-red-500"
                : slot.accessType === "faculty"
                  ? "bg-blue-600"
                  : slot.accessType === "parent"
                    ? "bg-purple-600"
                    : "bg-green-500"
              }`}
              style={{
                left: `${slot.x}px`,
                top: `${slot.y}px`,
                transform: "translate(-50%, -50%)"
              }}
            >
              {slot.slotNumber}
            </div>

          ))}

        </div>

        <div className="mt-8 rounded-[30px] bg-white p-6 shadow-lg border border-[#f3d2d9]">
          <h2 className="mb-4 text-2xl font-semibold text-[#ba0c2f]">Slots</h2>

          {slots.length === 0 ? (
            <p className="text-sm text-[#6b414a]">
              Click the map to add slots.
            </p>
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-[#f3d2d9] px-4 py-3 bg-[#fff5f7]"
                >
                  <div>
                    <p className="font-semibold">{slot.slotNumber}</p>
                    <p className="text-sm text-[#6b414a]">
                      Status: {slot.status}
                      {slot.bookedByName && (
                        <span>
                          {" "}- Booked by {slot.bookedByName}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <select
                      value={slot.accessType || "default"}
                      onChange={(e) =>
                        handleSlotTypeChange(slot._id, e.target.value)
                      }
                      disabled={slot.status === "booked"}
                      className="rounded-xl border border-[#f3d2d9] bg-white px-3 py-2 text-sm text-[#3b1a20] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {SLOT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(slot._id)}
                      className="rounded-2xl bg-[#ba0c2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8a0a23]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

    </div>
  );
}

export default AdminMapEditor;
