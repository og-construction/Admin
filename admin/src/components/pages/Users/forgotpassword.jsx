import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {!otpSent ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <p className="text-green-600">Check your email for the OTP!</p>
      )}
    </div>
  );
};

export default ForgotPassword;
