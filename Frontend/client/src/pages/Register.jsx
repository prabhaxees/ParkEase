import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", formData);

      alert("Registration successful. Please login.");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">

      <form
        onSubmit={handleRegister}
        className="bg-white/95 border border-[#f3d2d9] p-8 rounded-3xl shadow-[0_20px_50px_rgba(186,12,47,0.14)] w-96"
      >

        <h1 className="text-3xl font-bold text-center text-[#ba0c2f] mb-6">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border border-[#f3d2d9] p-3 rounded-xl mb-4 focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <select
          name="role"
          className="w-full border border-[#f3d2d9] p-3 rounded-xl mb-4 focus:border-[#ba0c2f] focus:ring-2 focus:ring-[#f7d9e0]"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="parent">Parent</option>
        </select>

        <button
          type="submit"
          className="w-full bg-[#ba0c2f] hover:bg-[#8a0a23] text-white p-3 rounded-xl transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-[#6b414a]">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-[#ba0c2f] hover:text-[#8a0a23]"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Register;
