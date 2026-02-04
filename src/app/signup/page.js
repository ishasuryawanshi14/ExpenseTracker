"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-sky-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-lg border border-blue-100">

        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Start tracking your expenses peacefully
        </p>

        <form onSubmit={handleSignup} className="space-y-5">

          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 border border-blue-200 bg-blue-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full mt-1 border border-blue-200 bg-blue-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full mt-1 border border-blue-200 bg-blue-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400 text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 shadow-sm"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-400 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
