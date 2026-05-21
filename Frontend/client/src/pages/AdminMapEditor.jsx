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

    <div className="page-shell">

      <Navbar />

      <main className="app-main">

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <h1 className="page-title text-4xl">
            {zone.name}
          </h1>

          {zone.status === "maintenance" && (
            <span className="badge">
              Maintenance Mode
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label
            htmlFor="newSlotType"
            className="text-sm font-bold text-white"
          >
            New slot type
          </label>

          <select
            id="newSlotType"
            value={newSlotType}
            onChange={(e) => setNewSlotType(e.target.value)}
            className="field max-w-48 py-2 text-sm"
          >
            {SLOT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="map-frame relative">

          <img
            src={zone.imageUrl}
            alt={zone.name}
            onClick={handleMapClick}
            className="max-w-full cursor-crosshair rounded-xl"
          />

          {slots.map((slot) => (

            <div
              key={slot._id}
              className={`slot-marker
              ${slot.status !== "available"
                ? "slot-marker--booked"
                : slot.accessType === "faculty"
                  ? "slot-marker--faculty"
                  : slot.accessType === "parent"
                    ? "slot-marker--parent"
                    : "slot-marker--available"
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

        <div className="card mt-8 p-6">
          <h2 className="section-title mb-4 text-2xl">Slots</h2>

          {slots.length === 0 ? (
            <p className="muted text-sm">
              Click the map to add slots.
            </p>
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className="admin-slot-row flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{slot.slotNumber}</p>
                    <p className="muted text-sm">
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
                      className="field w-auto py-2 text-sm disabled:opacity-60"
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
                      className="btn-danger text-sm"
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
