import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../components/logo.png";

import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      navigate("/zones");

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">

      <form
        onSubmit={handleLogin}
        className="bg-white/95 border border-[#f3d2d9] p-8 rounded-3xl shadow-[0_20px_50px_rgba(186,12,47,0.14)] w-96"
      >
        <img
        src={logo}
        alt="ParkEase Logo"
        className="h-14 w-auto object-contain mx-auto mb-6"
       />

        <h1 className="text-3xl font-bold text-center text-[#ba0c2f] mb-6">
          ParkEase
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-[#f3d2d9] p-3 rounded-xl mb-4 focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[#f3d2d9] p-3 rounded-xl mb-4 focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#ba0c2f] hover:bg-[#8a0a23] text-white p-3 rounded-xl transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-[#6b414a]">
          New to ParkEase?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#ba0c2f] hover:text-[#8a0a23]"
          >
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;
