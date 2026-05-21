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

    <div className="page-shell">

      <Navbar />

      <main className="app-main">

        <h1 className="page-title mb-8 text-4xl">
          My Bookings
        </h1>

        {bookings.length === 0 && (
          <div className="card p-6">
            <p className="muted">
              No bookings found.
            </p>
          </div>
        )}

        <div className="grid gap-4">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="card booking-card"
            >
              <div>

                <p className="booking-tab-label">
                  {booking.bookingType === "prebook" ? "Prebooked" : "Booked Now"}
                </p>

                <h2 className="section-title mt-1 text-2xl">
                  {booking.zoneId?.name}
                </h2>

                <p className="muted mt-2">
                  {getBookingTimeText(booking)}
                </p>

                {booking.bookingType === "prebook" && booking.endTime && (
                  <p className="muted mt-1">
                    Until: {new Date(booking.endTime).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="booking-slot-pill">
                  {booking.slotId?.slotNumber}
                </span>

                <button
                  type="button"
                  onClick={() => handleCancelBooking(booking._id)}
                  className="btn-danger text-sm"
                >
                  Cancel Booking
                </button>
              </div>
            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default MyBookings;
