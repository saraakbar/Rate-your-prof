import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

const containerStyle = {
  minHeight: "94.4vh"
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      // Make an API request to send a password reset email
      const response = await axios.post("http://localhost:8000/forgotPassword", {
        email: email
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Error sending password reset email");
    }
  };

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="min-h-screen bg-gray-700 relative">
          <div
            className="absolute top-0 w-full h-full"
            style={{
              backgroundImage: "url(/bg2e.png)",
              backgroundSize: "contain"
            }}
          ></div>
          <div className="container mx-auto px-4 h-min" style={containerStyle}>
            <div className="flex content-center items-center justify-center mt-8">
              <div className="w-full lg:w-4/12 mt-40">
                <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center">
                      <h6 className="text-gray-600 text-sm font-bold">{message}</h6>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div className="text-center">
                      {/* Email Input */}
                      <input
                        type="email"
                        placeholder="Email"
                        className="block w-full p-3 bg-white rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {/* Forgot Password Button */}
                      <button
                        className="mt-6 bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                        type="button"
                        onClick={handleForgotPassword}
                        style={{ transition: "all .15s ease" }}
                      >
                        Forgot Password
                      </button>

                      {/* Login and Sign Up Links */}
                      <div className="mt-4">
                        <NavLink to="/login" replace={true} className="text-gray-600">
                          Login
                        </NavLink>
                      </div>
                      <div className="mt-2">
                        <NavLink to="/register" className="text-gray-600">
                          Sign Up
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ForgotPassword;
