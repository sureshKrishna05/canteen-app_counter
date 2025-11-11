import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import logo from "../assets/Logo.jpg";
import { signup, sendVerificationEmail } from "../database/firestoreService"; // <-- IMPORT REAL FUNCTIONS

// --- SignupPage component ---
const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationActive, setVerificationActive] = useState(false); // We'll reuse this to show the "Check Email" message

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

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

    // --- REAL FIREBASE SIGNUP & VERIFICATION ---
    try {
      // Step 1: Create the user in Firebase Auth
      await signup(email, password);

      // Step 2: Send the verification email to the new user
      // (The user is now auth.currentUser)
      await sendVerificationEmail();

      // Step 3: Show the "Check your email" message
      setVerificationActive(true); // This hides the form
    } catch (err) {
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again.");
      }
      console.error("Signup error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Layout code: div, img, buttons, about/contact boxes are all identical) ...
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

      {/* Signup Card */}
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
            {/* ... (Password, Confirm Password inputs are the same) ... */}
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
                className="w-full rounded-md border-2 border-orange-400 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
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
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                "Create Account & Send Verification"
              )}
            </button>
          </form>
        )}

        {/* --- "CHECK YOUR EMAIL" MESSAGE (Shows when active) --- */}
        {verificationActive && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold text-green-700">Success!</h3>
            <p className="mt-2 font-medium text-gray-700">
              A verification link has been sent to{" "}
              <span className="font-bold text-orange-600">{email}</span>.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please check your inbox (and spam folder) and click the link to verify your account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-md bg-orange-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-orange-600"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* "Already have an account?" link */}
        {!verificationActive && (
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-semibold text-orange-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;