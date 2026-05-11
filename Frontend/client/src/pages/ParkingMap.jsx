import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

import Navbar from "../components/Navbar";

function ParkingMap() {

  const { zoneId } = useParams();

  const [zone, setZone] = useState(null);

  const [slots, setSlots] = useState([]);

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

  const handleBookSlot = async (slotId, slotNumber) => {

    try {

      const res = await API.put(
        `/slots/book/${slotId}`
      );

      const updatedSlots = slots.map((slot) =>

        slot._id === slotId
          ? res.data
          : slot

      );

      setSlots(updatedSlots);

      alert(`Slot ${slotNumber} booked successfully`);

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

  if (!zone) {

    return (
      <h1 className="text-2xl text-center mt-10">
        Loading...
      </h1>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main className="p-10">

        <h1 className="text-4xl font-bold mb-8">
          {zone.name}
        </h1>

        {/* Stats */}

        <div className="flex gap-6 mb-6">

          <div className="bg-white px-6 py-3 rounded-xl shadow">
            <p className="text-green-600 font-bold">
              Available: {availableSlots}
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-xl shadow">
            <p className="text-red-600 font-bold">
              Booked: {bookedSlots}
            </p>
          </div>

        </div>

        {/* Legend */}

        <div className="flex gap-6 mb-6">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <p>Available</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <p>Booked</p>
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
              onClick={() =>
                handleBookSlot(
                  slot._id,
                  slot.slotNumber
                )
              }
              disabled={slot.status === "booked"}
              className={`absolute px-2 py-1 rounded-full text-xs font-bold text-white transition

              ${slot.status === "available"

                ? "bg-green-500 hover:scale-110"

                : "bg-red-500 cursor-not-allowed opacity-80"

              }`}
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

      </main>

    </div>
  );
}

export default ParkingMap;
