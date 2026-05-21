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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Could not cancel booking");
    }
  };

  const getBookingTimeText = (booking) => {
    if (booking.bookingType === "prebook") {
      return `Reserved For: ${new Date(booking.startTime).toLocaleString()}`;
    }

    return `Booked At: ${new Date(booking.bookedAt).toLocaleString()}`;
  };

  return (

    <div className="min-h-screen bg-[#fff5f7]">

      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-8 text-[#ba0c2f]">
          My Bookings
        </h1>

        {bookings.length === 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#f3d2d9]">
            <p className="text-[#5d3b42]">
              No bookings found.
            </p>
          </div>
        )}

        <div className="grid gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="bg-white p-6 rounded-3xl shadow-lg border border-[#f3d2d9]"
            >

              <h2 className="text-2xl font-semibold mb-2">
                Zone: {booking.zoneId?.name}
              </h2>

              <p className="text-lg">
                Slot: {booking.slotId?.slotNumber}
              </p>

              <p className="text-[#6b414a] mt-2">
                {getBookingTimeText(booking)}
              </p>

              {booking.bookingType === "prebook" && booking.endTime && (
                <p className="text-[#6b414a] mt-1">
                  Until: {new Date(booking.endTime).toLocaleString()}
                </p>
              )}

              <p className="text-sm font-semibold text-[#ba0c2f] mt-3">
                {booking.bookingType === "prebook" ? "Prebooked" : "Booked Now"}
              </p>

              <button
                type="button"
                onClick={() => handleCancelBooking(booking._id)}
                className="mt-4 rounded-2xl bg-[#ba0c2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8a0a23]"
              >
                Cancel Booking
              </button>
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default MyBookings;
