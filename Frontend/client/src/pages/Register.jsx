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
    <div className="auth-shell">

      <form
        onSubmit={handleRegister}
        className="card w-full max-w-sm p-8"
      >

        <h1 className="page-title mb-2 text-center text-3xl">
          Register
        </h1>

        <p className="muted mb-6 text-center text-sm">
          Create a profile that matches your parking access.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="field mb-4"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="field mb-4"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="field mb-4"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="field mb-4"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="parent">Parent</option>
        </select>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Register
        </button>

        <p className="muted mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-bold text-[#08cbe4] hover:text-white"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Register;
