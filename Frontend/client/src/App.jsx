import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ParkingMap from "./pages/ParkingMap";
import Zones from "./pages/Zones";
import AdminMapEditor from "./pages/AdminMapEditor";
import MyBookings from "./pages/MyBookings";

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

function RequireAdmin({ children }) {
  return getUserRole() === "admin"
    ? children
    : <Navigate to="/zones" replace />;
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route path="/zones" element={<Zones />} />

        <Route
          path="/admin/map/:zoneId"
          element={
            <RequireAdmin>
              <AdminMapEditor />
            </RequireAdmin>
          }
        />

        <Route
          path="/map/:zoneId"
          element={<ParkingMap />}
        />
        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
