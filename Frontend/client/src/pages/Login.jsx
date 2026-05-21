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
    <div className="auth-shell">

      <form
        onSubmit={handleLogin}
        className="card w-full max-w-sm p-8"
      >
        <img
          src={logo}
          alt="ParkEase Logo"
          className="h-14 w-auto object-contain mx-auto mb-6"
        />

        <h1 className="page-title mb-2 text-center text-3xl">
          ParkEase
        </h1>

        <p className="muted mb-6 text-center text-sm">
          Sign in to find, book, and manage campus parking.
        </p>

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

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Login
        </button>

        <p className="muted mt-4 text-center text-sm">
          New to ParkEase?{" "}
          <Link
            to="/register"
            className="font-bold text-[#08cbe4] hover:text-white"
          >
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;
