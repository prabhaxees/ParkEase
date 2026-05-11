import { useEffect, useState } from "react";

import API from "../api/axios";

import Navbar from "../components/Navbar";

function MyBookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const res = await API.get("/bookings/my");

        setBookings(res.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchBookings();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">
              No bookings found.
            </p>
          </div>
        )}

        <div className="grid gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="bg-white p-6 rounded-xl shadow"
            >

              <h2 className="text-2xl font-semibold mb-2">
                Zone: {booking.zoneId?.name}
              </h2>

              <p className="text-lg">
                Slot: {booking.slotId?.slotNumber}
              </p>

              <p className="text-gray-500 mt-2">
                Booked At:
                {" "}
                {new Date(
                  booking.bookedAt
                ).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default MyBookings;
