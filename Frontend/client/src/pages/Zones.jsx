import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import Navbar from "../components/Navbar";

function Zones() {

  const [zones, setZones] = useState([]);

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

  return (

    <div className="min-h-screen bg-[#fff5f7]">

      <Navbar />

      <main className="p-10">

        <h1 className="text-4xl font-bold mb-8 text-center text-[#ba0c2f]">
          Parking Zones
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {zones.map((zone) => (

            <Link
              to={`/map/${zone._id}`}
              key={zone._id}
            >

              <div className="bg-white rounded-3xl shadow-lg border border-[#f3d2d9] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300 cursor-pointer">

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

            </Link>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Zones;
