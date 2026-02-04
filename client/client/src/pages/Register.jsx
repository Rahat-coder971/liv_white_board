import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    try {
      await axios.post("/auth/register", {
        name,
        email,
        password
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Register failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-[350px] shadow-lg">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <input
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
