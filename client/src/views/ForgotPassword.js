import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import basestyle from "../styles/Base.module.css";
import { useEffect } from "react";

const containerStyle = {
  minHeight: "94.4vh"
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values) {
      errors.email = "Email is required";

    } else if (!regex.test(values)) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
  };

  const sendError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    })
  }


  const handleForgotPassword = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(email));
    setIsSubmit(true);
  }

  useEffect(() => {
    const sendForgotPasswordEmail = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        try {
          setIsLoading(true);
          const response = await axios.post("http://localhost:8000/forgotPassword", {
            email: email
          });

          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
          })

          setIsLoading(false);

        } catch (error) {
          console.error(error);
          sendError(error.response.data.message);
          setIsLoading(false);

        }
      }
    }

    sendForgotPasswordEmail();
  }, [formErrors]);



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
              <div className="w-full lg:w-4/12 mt-32">
                <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center">
                      <h1 className="text-gray-900 text-md font-bold">Reset your password</h1>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <span className="text-gray-700 text-sm">Enter your email below, and we’ll send you a message with your username and a link to reset your password. </span>
                    <div className="text-center mt-4">
                      {/* Email Input */}
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="block w-full p-3 bg-white rounded rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className={basestyle.error}>{formErrors.email}</p>

                      {/* Loading animation */}
                      {isLoading && <div className="mt-2 spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>}

                      {/* Forgot Password Button */}
                      <button
                        className="mt-6 bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                        type="button"
                        onClick={handleForgotPassword}
                        style={{ transition: "all .15s ease" }}
                      >
                        Send Reset Email
                      </button>
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
