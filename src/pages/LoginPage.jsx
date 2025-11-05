import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";
import bgImage from "../assets/login-bg.jpg";

const LoginPage = ({ setActivePage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setActivePage("Dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") setError("User not found!");
      else if (err.code === "auth/wrong-password") setError("Wrong password!");
      else setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const Button = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white/80 text-gray-700 font-medium rounded-full hover:bg-[#ff6600] hover:text-white transition"
    >
      {label}
    </button>
  );

  const Popup = ({ title, content }) => (
    <div className="absolute top-20 right-8 w-[320px] bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-5 animate-fadeIn z-20">
      <h3 className="text-lg font-semibold text-[#ff6600] mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  );

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center font-[Poppins] overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Top buttons */}
      <div className="absolute top-5 right-8 flex gap-3 z-20">
        <Button
          label="About Us"
          onClick={() => {
            setShowAbout(!showAbout);
            setShowContact(false);
          }}
        />
        <Button
          label="Contact Us"
          onClick={() => {
            setShowContact(!showContact);
            setShowAbout(false);
          }}
        />
      </div>

      {/* Popups */}
      {showAbout && (
        <Popup
          title="About Us"
          content="Our Smart Canteen App provides a seamless dining experience with pre-ordering, cashless payments, and real-time updates. It reduces wait times, prevents food waste, and improves efficiency through smart analytics."
        />
      )}
      {showContact && (
        <Popup
          title="Contact Us"
          content="📩 smartcanteen29@gmail.com"
        />
      )}

      {/* Login Card */}
      <div className="relative z-10 bg-white/85 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[350px] text-center border border-white/40">
        <h2 className="text-2xl font-bold mb-4 text-[#ff6600]">Login</h2>

        {error && (
          <div className="mb-3 text-red-600 text-sm bg-red-100/80 p-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border-2 border-[#ff6600] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600]/70 bg-white/60"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border-2 border-[#ff6600] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600]/70 bg-white/60"
          />

          <div className="text-right text-sm text-gray-700 cursor-pointer hover:text-[#ff6600]">
            Forgot Password?
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff6600] hover:bg-[#e65c00] active:bg-[#cc5200]"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-800">
          Don’t have an account?{" "}
          <span className="text-[#ff6600] font-semibold cursor-pointer hover:underline">
            Sign Up
          </span>
        </div>
      </div>

      {/* Fade Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-in; }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
