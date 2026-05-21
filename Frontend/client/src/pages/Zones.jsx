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

    <div className="page-shell">

      <Navbar />

      <main className="app-main">

        <h1 className="page-title mb-8 text-center text-4xl">
          Parking Zones
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {zones.map((zone) => (

            <Link
              to={`/map/${zone._id}`}
              key={zone._id}
            >

              <div className="card zone-card interactive-card cursor-pointer overflow-hidden">

                <img
                  src={zone.imageUrl}
                  alt={zone.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-5">

                  <h2 className="section-title text-2xl">
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
