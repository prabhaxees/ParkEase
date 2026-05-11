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

  }, []);

  const fetchZone = async () => {

    const res = await API.get("/zones");

    const foundZone = res.data.find(
      (z) => z._id === zoneId
    );

    setZone(foundZone);
  };

  const fetchSlots = async () => {

    const res = await API.get(`/slots/${zoneId}`);

    setSlots(res.data);
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

    const res = await API.post(
      "/slots",
      slotData
    );

    setSlots([...slots, res.data]);
  };

  if (!zone) return <h1>Loading...</h1>;

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-6">
        {zone.name}
      </h1>

      <div className="relative w-fit">

        <img
          src={zone.imageUrl}
          alt=""
          onClick={handleMapClick}
          className="rounded-xl shadow-lg"
        />

        {slots.map((slot) => (

          <div
            key={slot._id}
            className="absolute bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold"
            style={{
              left: slot.x,
              top: slot.y
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