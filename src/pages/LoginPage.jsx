import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/Logo.jpg";
// No more lucide-react import

// NOTE: All layout code (background, logo, etc.) is now in this one file.
// No more AuthLayout.jsx.

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true); // Start loading

    // --- FAKE LOGIN ---
    // Replace this with your actual Firebase login logic
    console.log("Attempting login with:", email);
    setTimeout(() => {
      if (email === "test@test.com" && password === "password") {
        console.log("Login successful!");
        // navigate("/dashboard"); // Uncomment this on success
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false); // Stop loading
    }, 1500); // Simulate a 1.5 second network request
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center font-poppins"
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/40"></div>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="absolute left-4 top-4 z-10 w-24 cursor-pointer sm:left-8 sm:top-5 sm:w-32"
        onClick={() => navigate("/")}
      />

      {/* Top-right buttons */}
      <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-8 sm:top-5">
        <button
          onClick={() => {
            setShowAbout(!showAbout);
            setShowContact(false);
          }}
          className="rounded-full bg-white/85 px-3.5 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-orange-600 hover:text-white sm:text-base"
        >
          About Us
        </button>
        <button
          onClick={() => {
            setShowContact(!showContact);
            setShowAbout(false);
          }}
          className="rounded-full bg-white/85 px-3.5 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-orange-600 hover:text-white sm:text-base"
        >
          Contact Us
        </button>
      </div>

      {/* About box */}
      {showAbout && (
        <div className="absolute right-8 top-20 z-10 w-80 rounded-xl bg-white/95 p-5 text-sm text-gray-800 shadow-xl backdrop-blur-sm">
          <h3 className="mt-0 text-lg font-semibold text-orange-600">About Us</h3>
          <p>
            Our Smart Canteen App provides a seamless dining experience.
          </p>
        </div>
      )}

      {/* Contact box */}
      {showContact && (
        <div className="absolute right-8 top-20 z-10 w-72 rounded-xl bg-white/95 p-5 text-sm text-gray-800 shadow-xl backdrop-blur-sm">
          <h3 className="mt-0 text-lg font-semibold text-orange-600">Contact Us</h3>
          <p className="font-medium">
            📩{" "}
            <a
              href="mailto:smartcanteen29@gmail.com"
              className="font-bold text-orange-600 no-underline"
            >
              smartcanteen29@gmail.com
            </a>
          </p>
        </div>
      )}

      {/* Login Box - NEW "Frosted Glass" DESIGN */}
      <div className="relative z-10 w-[360px] rounded-2xl border border-white/20 bg-white/50 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <h2 className="mb-6 text-center text-2xl font-semibold text-orange-600">
          Counter Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
            />
          </div>
          
          {error && (
            <p className="text-center text-sm font-medium text-red-600">{error}</p>
          )}

          <div className="text-right">
            <span className="cursor-pointer text-sm text-gray-700 hover:text-orange-600 hover:underline">
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-orange-500 py-2.5 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              // This is the new Tailwind spinner
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer font-semibold text-orange-600 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;