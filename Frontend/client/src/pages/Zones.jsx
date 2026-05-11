import { useEffect, useState } from "react";

import API from "../api/axios";

function Zones() {

  const [zones, setZones] = useState([]);

  useEffect(() => {

    fetchZones();

  }, []);

  const fetchZones = async () => {

    try {

      const res = await API.get("/zones");

      setZones(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Parking Zones
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {zones.map((zone) => (

          <div
            key={zone._id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={zone.imageUrl}
              alt={zone.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-4">

              <h2 className="text-2xl font-semibold">
                {zone.name}
              </h2>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Zones;