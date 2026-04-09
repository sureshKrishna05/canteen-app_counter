import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/Logo.jpg";
// 🟢 IMPORT REAL SUPABASE FUNCTIONS
import { signup } from "../database/supabaseService"; 
import { supabase } from "../database/supabaseClient"; // Import client for verification

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  // OTP State
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationActive, setVerificationActive] = useState(false);

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // --- Step 1: Handle Signup ---
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("All fields are required");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 🟢 REAL SUPABASE SIGNUP
      await signup(email, password);
      setVerificationActive(true); 
    } catch (err) {
      if (err.message?.includes("already registered")) {
        setError("This email is already in use.");
      } else if (err.message?.includes("Password should be at least")) {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Handle OTP Verification ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      // 🟢 Verify OTP directly with Supabase
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup',
      });

      if (verifyError) throw verifyError;

      // Verification successful, redirect to login
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center font-poppins"
    >
      <div className="absolute inset-0 z-0 bg-black/40"></div>
      <img
        src={logo}
        alt="Logo"
        className="absolute left-4 top-4 z-10 w-24 cursor-pointer sm:left-8 sm:top-5 sm:w-32"
        onClick={() => navigate("/")}
      />
      <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-8 sm:top-5">
        <button
          onClick={() => { setShowAbout(!showAbout); setShowContact(false); }}
          className="rounded-full bg-white/85 px-3.5 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-orange-600 hover:text-white sm:text-base"
        >
          About Us
        </button>
        <button
          onClick={() => { setShowContact(!showContact); setShowAbout(false); }}
          className="rounded-full bg-white/85 px-3.5 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-orange-600 hover:text-white sm:text-base"
        >
          Contact Us
        </button>
      </div>

      {showAbout && (
        <div className="absolute right-8 top-20 z-10 w-80 rounded-xl bg-white/95 p-5 text-sm text-gray-800 shadow-xl backdrop-blur-sm">
          <h3 className="mt-0 text-lg font-semibold text-orange-600">About Us</h3>
          <p>Our Smart Canteen App provides a seamless dining experience.</p>
        </div>
      )}

      {showContact && (
        <div className="absolute right-8 top-20 z-10 w-72 rounded-xl bg-white/95 p-5 text-sm text-gray-800 shadow-xl backdrop-blur-sm">
          <h3 className="mt-0 text-lg font-semibold text-orange-600">Contact Us</h3>
          <p className="font-medium">
            📩 <a href="mailto:smartcanteen29@gmail.com" className="font-bold text-orange-600 no-underline">smartcanteen29@gmail.com</a>
          </p>
        </div>
      )}

      {/* Signup/OTP Card */}
      <div className="relative z-10 w-[380px] rounded-2xl border border-white/20 bg-white/50 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} alt="Logo" className="mb-3 w-20 rounded-md shadow-md" />
          <h2 className="text-2xl font-semibold text-orange-600">
            {verificationActive ? "Verify Email" : "Create Account"}
          </h2>
        </div>

        {/* --- SIGNUP FORM --- */}
        {!verificationActive && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="mb-1 block font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label className="mb-1 block font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                placeholder="Confirm password"
              />
            </div>

            {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-orange-500 py-2 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div> : "Create Account"}
            </button>
            
            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span className="cursor-pointer font-semibold text-orange-600 hover:underline" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </form>
        )}

        {/* --- OTP VERIFICATION FORM --- */}
        {verificationActive && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <p className="font-medium text-gray-700">
              A 6-digit OTP has been sent to: <br/>
              <span className="font-bold text-orange-600">{email}</span>
            </p>
            
            <div className="mt-4">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
                disabled={loading}
                className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-md border-2 border-orange-400 px-3 py-3 outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                placeholder="000000"
              />
            </div>

            {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-md bg-green-600 py-2 font-semibold text-white shadow-md hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div> : "Verify OTP"}
            </button>
            
            <button
              type="button"
              onClick={() => setVerificationActive(false)}
              className="mt-4 w-full text-sm font-medium text-gray-500 hover:text-orange-600"
            >
              Back to Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;