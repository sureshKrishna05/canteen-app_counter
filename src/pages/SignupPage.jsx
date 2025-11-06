import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/Logo.jpg";
// No lucide-react import

// NOTE: All layout code (background, logo, etc.) is now in this one file.
// No more AuthLayout.jsx.

// --- VerificationInput component (local to this file) ---
const VerificationInput = ({ length = 6, onVerify }) => {
  const [code, setCode] = useState(Array(length).fill(""));
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...code];
    updated[index] = value;
    setCode(updated);
    if (value && index < length - 1) inputsRef.current[index + 1].focus();

    const joined = updated.join("");
    // --- FAKE OTP ---
    // Replace "123456" with your real OTP logic
    if (joined.length === length && joined === "123456") {
      setVerified(true);
      setTimeout(() => onVerify(joined), 500);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputsRef.current[index - 1].focus();
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {code.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          maxLength="1"
          value={val}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`w-10 h-10 text-center text-lg font-semibold border-2 rounded-md outline-none transition-all
            ${
              verified
                ? "border-green-500 shadow-green-300 shadow-md"
                : "border-orange-500 focus:ring-2 focus:ring-orange-400"
            }`}
        />
      ))}
    </div>
  );
};

// --- SignupPage component ---
const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [timer, setTimer] = useState(0);
  const [verificationActive, setVerificationActive] = useState(false);

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);

  const handleSignup = (e) => {
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

    // --- FAKE SIGNUP & OTP ---
    // Replace this with your actual Firebase logic
    // (e.g., send OTP, then show verification)
    console.log("Sending OTP to:", email);
    setTimeout(() => {
      setLoading(false);
      setVerificationActive(true); // This hides the form and shows the OTP inputs
      setTimer(300); // 5 mins
    }, 1500);
  };

  const handleVerified = (otpCode) => {
    console.log("OTP Verified:", otpCode);
    console.log("Creating user with:", email);
    // NOTE: This is where you would call Firebase's
    // `createUserWithEmailAndPassword` or `confirmOtp` logic.
    navigate("/login");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
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

      {/* About/Contact boxes (same as login) */}
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


      {/* Signup Card - NEW "Frosted Glass" DESIGN */}
      <div className="relative z-10 w-[380px] rounded-2xl border border-white/20 bg-white/50 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} alt="Logo" className="mb-3 w-20 rounded-md shadow-md" />
          <h2 className="text-2xl font-semibold text-orange-600">Create Account</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sign up to access the counter system
          </p>
        </div>

        {/* --- SIGNUP FORM (Hides on verification) --- */}
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
              <label className="mb-1 block font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-a-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                placeholder="Confirm password"
              />
            </div>

            {error && (
              <p className="text-center text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-orange-500 py-2 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                // This is the new Tailwind spinner
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {/* --- OTP VERIFICATION (Shows when active) --- */}
        {verificationActive && (
          <div className="mt-4 text-center">
            {timer > 0 ? (
              <>
                <p className="mb-2 font-medium text-gray-700">
                  Verification code sent to{" "}
                  <span className="font-bold text-orange-600">{email}</span>
                </p>
                <p className="mb-3 text-sm text-gray-500">
                  Expires in <span className="font-semibold">{formatTime(timer)}</span>
                </p>
                <VerificationInput onVerify={handleVerified} />
              </>
            ) : (
              <button
                onClick={() => handleSignup({ preventDefault: () => {} })} // Resend logic
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-orange-600 disabled:opacity-70"
              >
                 {loading ? (
                  // This is the new Tailwind spinner
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  "Resend Code"
                )}
              </button>
            )}
          </div>
        )}

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="cursor-pointer font-semibold text-orange-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;