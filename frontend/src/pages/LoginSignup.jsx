// src/pages/LoginSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

function LoginSignup() {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload =
        mode === "signup"
          ? { name, email, password } // REMOVE role: "admin"
          : { email, password };

      const endpoint = mode === "signup" ? "/auth/register" : "/auth/login";
      const res = await axios.post(endpoint, payload);

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", decoded.role);

      alert("✅ Auth Success");
      navigate("/");
    } catch (err) {
      alert("❌ Auth Failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <div className="flex justify-around mb-4">
        <button
          onClick={() => setMode("login")}
          className={`font-semibold ${mode === "login" ? "text-blue-600" : "text-gray-500"}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`font-semibold ${mode === "signup" ? "text-blue-600" : "text-gray-500"}`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">{mode === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        )}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default LoginSignup;
