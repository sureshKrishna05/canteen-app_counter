import React, { useState } from "react";
import bgImage from "../assets/login-bg.jpg";

const LoginPage = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login successful!");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Black transparent overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)", // low transparency dark layer
          zIndex: 0,
        }}
      ></div>

      {/* Top corner buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          display: "flex",
          gap: "10px",
          zIndex: 2,
        }}
      >
        <div
          onClick={() => {
            setShowAbout(!showAbout);
            setShowContact(false);
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            color: "#333",
            padding: "8px 14px",
            borderRadius: "20px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#ff6600";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "rgba(255,255,255,0.85)";
            e.target.style.color = "#333";
          }}
        >
          About Us
        </div>

        <div
          onClick={() => {
            setShowContact(!showContact);
            setShowAbout(false);
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            color: "#333",
            padding: "8px 14px",
            borderRadius: "20px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#ff6600";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "rgba(255,255,255,0.85)";
            e.target.style.color = "#333";
          }}
        >
          Contact Us
        </div>
      </div>

      {/* About box */}
      {showAbout && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            right: "30px",
            width: "330px",
            backgroundColor: "rgba(255,255,255,0.92)",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            fontSize: "14px",
            color: "#333",
            zIndex: 2,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#ff6600" }}>About Us</h3>
          <p>
            Our Smart Canteen App provides a seamless dining experience with
            pre-ordering, cashless payments, and real-time updates to reduce
            wait times and enhance convenience. It also promotes eco-friendly
            practices by minimizing food wastage and improving canteen
            management through smart analytics and intuitive design.
          </p>
        </div>
      )}

      {/* Contact box */}
      {showContact && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            right: "30px",
            width: "300px",
            backgroundColor: "rgba(255,255,255,0.92)",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            fontSize: "14px",
            color: "#333",
            zIndex: 2,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#ff6600" }}>Contact Us</h3>
          <p style={{ fontWeight: "bold" }}>📩 smartcanteen29@gmail.com</p>
        </div>
      )}

      {/* Login Box */}
      <div
        style={{
          width: "350px",
          backgroundColor: "rgba(255,255,255,0.88)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#ff6600" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            required
            style={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: "2px solid #ff6600",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            style={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: "2px solid #ff6600",
              borderRadius: "8px",
              outline: "none",
            }}
          />

          {/* Forgot Password */}
          <div
            style={{
              textAlign: "right",
              marginBottom: "15px",
              fontSize: "14px",
              color: "black",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#ff6600",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.8")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Login
          </button>
        </form>

        {/* Sign Up Row */}
        <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "black",
          }}
        >
          Don’t have an account?{" "}
          <span style={{ color: "#ff6600", fontWeight: "bold", cursor: "pointer" }}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

