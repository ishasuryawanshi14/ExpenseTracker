"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-sky-100 px-4">

    <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md border border-blue-100">

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Welcome Back
      </h2>

      <p className="text-gray-500 mb-8">
        Login to access your dashboard
      </p>

      <form onSubmit={handleLogin} className="space-y-6">

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-2 bg-blue-50 border border-blue-200 p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-2 bg-blue-50 border border-blue-200 p-3 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 shadow-sm"
        >
          {loading ? " Loggin..." : "LOG In"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-500 font-medium cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>

      </form>
    </div>
  </div>
);
}