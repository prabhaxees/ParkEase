import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api/axios";

function AdminMapEditor() {

  const { zoneId } = useParams();

  const [zone, setZone] = useState(null);

  const [slots, setSlots] = useState([]);

  useEffect(() => {

    fetchZone();

    fetchSlots();

  }, [zoneId]);

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

  const handleMapClick = async (e) => {

    const x = e.nativeEvent.offsetX;

    const y = e.nativeEvent.offsetY;

    const slotData = {

      slotNumber: `S${slots.length + 1}`,

      zoneId,

      x,

      y

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

  if (!zone) {

    return (
      <h1 className="text-2xl text-center mt-10">
        Loading...
      </h1>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        {zone.name}
      </h1>

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
              ${slot.status === "available"
                ? "bg-green-500"
                : "bg-red-500"
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

    </div>
  );
}

export default AdminMapEditor;