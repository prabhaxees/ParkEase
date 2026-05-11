import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ParkingMap from "./pages/ParkingMap";
import Zones from "./pages/Zones";
import AdminMapEditor from "./pages/AdminMapEditor";
import MyBookings from "./pages/MyBookings";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/zones" element={<Zones />} />

        <Route
          path="/admin/map/:zoneId"
          element={<AdminMapEditor />}
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