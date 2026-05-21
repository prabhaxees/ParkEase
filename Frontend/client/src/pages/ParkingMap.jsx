import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

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
      return "slot-marker--booked";
    }

    if (slot.nextReservationTime) {
      return "slot-marker--reserved";
    }

    if (slot.accessType === "faculty") {
      return "slot-marker--faculty";
    }

    if (slot.accessType === "parent") {
      return "slot-marker--parent";
    }

    return "slot-marker--available";
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

    <div className="page-shell">

      <Navbar />

      <main className="app-main parking-map-main">

        <div className="parking-workspace parking-map-workspace">
          <aside className="garage-panel garage-info-panel">
            <div className="garage-title-row">
              <div>
                <Link
                  to="/zones"
                  className="garage-back-pill"
                  aria-label="Back to zones"
                >
                  {"<"}
                </Link>

                <h1 className="page-title mt-6 text-4xl">
                  {zone.name}
                </h1>

                <div className="garage-meta">
                  <span>{availableSlots}/{slots.length || 0} open</span>
                  <span>{zone.status === "maintenance" ? "Maintenance" : "Live zone"}</span>
                </div>
              </div>

              {zone.status === "maintenance" && (
                <span className="badge">
                  Maintenance
                </span>
              )}
            </div>

            <div className="stat-grid">
              <div className="stat-card is-active">
                <span>Available</span>
                <strong>{availableSlots}</strong>
              </div>

              <div className="stat-card">
                <span>Occupied</span>
                <strong>{bookedSlots}</strong>
              </div>

              <div className="stat-card">
                <span>Total</span>
                <strong>{slots.length}</strong>
              </div>
            </div>

            <div className="booking-tab">
              <p className="booking-tab-label">
                Booking
              </p>

              <p className="booking-tab-value">
                {selectedSlot ? `Slot ${selectedSlot.slotNumber}` : "Select a slot"}
              </p>

              <p className="booking-tab-note">
                No charges applied.
              </p>
            </div>

            <div className="legend-panel">
              <div className="legend-item">
                <span className="legend-dot available"></span>
                <p>Available</p>
              </div>

              <div className="legend-item">
                <span className="legend-dot booked"></span>
                <p>Booked</p>
              </div>

              <div className="legend-item">
                <span className="legend-dot faculty"></span>
                <p>Faculty only</p>
              </div>

              <div className="legend-item">
                <span className="legend-dot parent"></span>
                <p>Parent only</p>
              </div>

              <div className="legend-item">
                <span className="legend-dot prebooked"></span>
                <p>Prebooked</p>
              </div>
            </div>
          </aside>

          <section className="garage-panel map-panel">
            <div className="map-panel-header">
              <div>
                <p className="booking-tab-label">
                  Parking Layout
                </p>

                <h2 className="section-title text-2xl">
                  {zone.name}
                </h2>
              </div>

              <div className="map-floor-tabs">
                <button type="button" className="floor-tab is-active">
                  1st
                </button>

                <button type="button" className="floor-tab" disabled>
                  A
                </button>

                <button type="button" className="floor-tab" disabled>
                  B
                </button>
              </div>
            </div>

            <div className="map-frame">

              <img
                src={zone.imageUrl}
                alt={zone.name}
              />

              {slots.map((slot) => (

                <button
                  key={slot._id}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!canBookSlot(slot)}
                  title={SLOT_TYPE_LABELS[slot.accessType || "default"]}
                  className={`slot-marker ${getSlotClassName(slot)}`}
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
          </section>
        </div>

        {selectedSlot && (
          <div className="booking-modal">
            <div className="booking-sheet">
              <div className="booking-sheet-top">
                <div>
                  <p className="booking-tab-label">
                    Selected Slot
                  </p>

                  <h2 className="section-title mt-1 text-2xl">
                    No-charge booking
                  </h2>
                </div>

                <span className="slot-number-badge">
                  {selectedSlot.slotNumber}
                </span>
              </div>

              {selectedSlot.nextReservationTime && (
                <p className="muted mt-4 text-sm">
                  Next reservation:{" "}
                  {new Date(selectedSlot.nextReservationTime).toLocaleString()}
                </p>
              )}

              <div className="time-box">
                <p className="booking-tab-label">
                  Arrive Time
                </p>

                <input
                  type="datetime-local"
                  min={minimumPrebookTime}
                  value={prebookTime}
                  onChange={(e) => setPrebookTime(e.target.value)}
                  className="field mt-3"
                />
              </div>

              <div className="booking-actions">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSlot(null);
                    setPrebookTime("");
                  }}
                  className="btn-ghost text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={Boolean(selectedSlot.nextReservationTime)}
                  onClick={() =>
                    handleBookSlot(selectedSlot._id, selectedSlot.slotNumber)
                  }
                  className="btn-secondary text-sm disabled:opacity-60"
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
                  className="btn-primary text-sm disabled:opacity-60"
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
