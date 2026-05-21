import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

import Navbar from "../components/Navbar";

const SLOT_TYPE_LABELS = {
  default: "Default",
  faculty: "Faculty only",
  parent: "Parent only"
};

const getUserRole = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
};

const toDateTimeLocalValue = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return offsetDate.toISOString().slice(0, 16);
};

const getMinimumPrebookTime = () => {
  const minimumDate = new Date(Date.now() + 5 * 60 * 1000);
  minimumDate.setSeconds(0, 0);

  return toDateTimeLocalValue(minimumDate);
};

function ParkingMap() {

  const { zoneId } = useParams();

  const [zone, setZone] = useState(null);

  const [slots, setSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [prebookTime, setPrebookTime] = useState("");

  const [minimumPrebookTime, setMinimumPrebookTime] = useState("");

  const userRole = getUserRole();

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

  const handleBookSlot = async (slotId, slotNumber, startTime) => {
    if (zone?.status === "maintenance") {
      alert("This zone is currently under maintenance and cannot be booked.");
      return;
    }

    try {
      const res = await API.put(
        `/slots/book/${slotId}`,
        startTime ? { startTime } : {}
      );

      const updatedSlots = slots.map((slot) =>
        slot._id === slotId
          ? res.data
          : slot
      );

      setSlots(updatedSlots);

      alert(
        startTime
          ? `Slot ${slotNumber} prebooked successfully`
          : `Slot ${slotNumber} booked successfully`
      );

      setSelectedSlot(null);
      setPrebookTime("");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not book slot");
    }
  };

  const availableSlots = slots.filter(
    (slot) => slot.status === "available"
  ).length;

  const bookedSlots = slots.filter(
    (slot) => slot.status === "booked"
  ).length;

  const canBookSlot = (slot) =>
    slot.status === "available" &&
    zone.status !== "maintenance" &&
    (!slot.accessType ||
      slot.accessType === "default" ||
      slot.accessType === userRole);

  const getSlotClassName = (slot) => {
    if (slot.status === "booked" || zone.status === "maintenance") {
      return "bg-red-500 cursor-not-allowed opacity-80";
    }

    if (slot.nextReservationTime) {
      return "bg-yellow-500 hover:scale-110";
    }

    if (slot.accessType === "faculty") {
      return canBookSlot(slot)
        ? "bg-blue-600 hover:scale-110"
        : "bg-blue-600 cursor-not-allowed opacity-70";
    }

    if (slot.accessType === "parent") {
      return canBookSlot(slot)
        ? "bg-purple-600 hover:scale-110"
        : "bg-purple-600 cursor-not-allowed opacity-70";
    }

    return "bg-green-500 hover:scale-110";
  };

  const canPrebook = ["faculty", "parent"].includes(userRole);

  const handleSlotClick = (slot) => {
    if (canPrebook) {
      setSelectedSlot(slot);
      setPrebookTime("");
      setMinimumPrebookTime(getMinimumPrebookTime());
      return;
    }

    if (slot.nextReservationTime) {
      alert("This slot already has an upcoming reservation.");
      return;
    }

    handleBookSlot(slot._id, slot.slotNumber);
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
              Under Maintenance
            </span>
          )}
        </div>

        {/* Parking Layout Summary */}

        <div className="grid gap-4 mb-6 md:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-white p-6 shadow-lg border border-[#f3d2d9] max-w-xl">
            <h2 className="mb-4 text-2xl font-semibold text-[#3b1a20]">
              Parking Layout
            </h2>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#fff5f7] p-4 text-sm text-[#6b414a] shadow-sm border border-[#f3d2d9]">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ba0c2f] mb-1">
                  Total Spaces
                </p>
                <p className="text-3xl font-bold text-[#3b1a20]">{slots.length}</p>
              </div>

              <div className="rounded-3xl bg-[#fff5f7] p-4 text-sm text-[#6b414a] shadow-sm border border-[#f3d2d9]">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ba0c2f] mb-1">
                  Occupied
                </p>
                <p className="text-3xl font-bold text-[#3b1a20]">{bookedSlots}</p>
              </div>

              <div className="rounded-3xl bg-[#fff5f7] p-4 text-sm text-[#6b414a] shadow-sm border border-[#f3d2d9]">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ba0c2f] mb-1">
                  Available
                </p>
                <p className="text-3xl font-bold text-[#3b1a20]">{availableSlots}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}

        <div className="flex gap-6 mb-6">

          <div className="flex items-center gap-2 text-sm text-[#3b1a20]">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <p>Available</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#3b1a20]">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <p>Booked</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#3b1a20]">
            <div className="w-4 h-4 bg-blue-600 rounded-full shadow-sm"></div>
            <p>Faculty only</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#3b1a20]">
            <div className="w-4 h-4 bg-purple-600 rounded-full shadow-sm"></div>
            <p>Parent only</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#3b1a20]">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <p>Prebooked</p>
          </div>

        </div>

        {/* Parking Map */}

        <div className="relative w-fit">

          <img
            src={zone.imageUrl}
            alt={zone.name}
            className="rounded-xl shadow-lg max-w-full"
          />

          {slots.map((slot) => (

            <button
              key={slot._id}
              onClick={() => handleSlotClick(slot)}
              disabled={!canBookSlot(slot)}
              title={SLOT_TYPE_LABELS[slot.accessType || "default"]}
              className={`absolute px-2 py-1 rounded-full text-xs font-bold text-white transition

              ${getSlotClassName(slot)}`}
              style={{
                left: `${slot.x}px`,
                top: `${slot.y}px`,
                transform: "translate(-50%, -50%)"
              }}
            >
              {slot.slotNumber}
            </button>

          ))}

        </div>

        {selectedSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-[#f3d2d9]">
              <h2 className="text-2xl font-semibold text-[#3b1a20]">
                Slot {selectedSlot.slotNumber}
              </h2>

              <p className="mt-2 text-sm text-[#6b414a]">
                Choose a time to prebook this slot for one hour.
              </p>

              {selectedSlot.nextReservationTime && (
                <p className="mt-3 rounded-2xl bg-[#fff5f7] px-3 py-2 text-sm text-[#6b414a]">
                  Next reservation:{" "}
                  {new Date(selectedSlot.nextReservationTime).toLocaleString()}
                </p>
              )}

              <input
                type="datetime-local"
                min={minimumPrebookTime}
                value={prebookTime}
                onChange={(e) => setPrebookTime(e.target.value)}
                className="mt-5 w-full rounded-xl border border-[#f3d2d9] p-3 text-[#3b1a20] focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
              />

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSlot(null);
                    setPrebookTime("");
                  }}
                  className="rounded-2xl border border-[#f3d2d9] px-4 py-2 text-sm font-semibold text-[#3b1a20] transition hover:bg-[#fff5f7]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={Boolean(selectedSlot.nextReservationTime)}
                  onClick={() =>
                    handleBookSlot(selectedSlot._id, selectedSlot.slotNumber)
                  }
                  className="rounded-2xl bg-[#3b1a20] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5d2b35] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Book Now
                </button>

                <button
                  type="button"
                  disabled={!prebookTime}
                  onClick={() =>
                    handleBookSlot(
                      selectedSlot._id,
                      selectedSlot.slotNumber,
                      new Date(prebookTime).toISOString()
                    )
                  }
                  className="rounded-2xl bg-[#ba0c2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8a0a23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Prebook
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default ParkingMap;
