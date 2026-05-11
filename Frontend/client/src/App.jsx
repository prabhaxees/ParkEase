import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ParkingMap from "./pages/ParkingMap";
import Zones from "./pages/Zones";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/map" element={<ParkingMap />} />
        <Route path="/zones" element={<Zones />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;