import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      navigate("/room/home");

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-[360px] shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
