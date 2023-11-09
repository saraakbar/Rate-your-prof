import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
  };
  return (
    <>
    <Navbar transparent />
      <main>
      <section className="min-h-screen bg-gray-700 relative">
          <div
            className="absolute top-0 w-full h-full"
            style={{
              backgroundImage: "url(/register_bg_2.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat"
            }}
          ></div>
          <div className="container mx-auto px-4 h-min">
            <div className="flex content-center items-center justify-center min-h-screen mt-8">
              <div className="w-full lg:w-4/12 px-4 mt-24 mb-8">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                      <h6 className="text-gray-600 text-sm font-bold">Sign up with</h6>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form>
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first-name"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="First Name"
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last-name"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Last Name"
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Username"
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="erp">
                          ERP
                        </label>
                        <input
                          type="text"
                          id="erp"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="ERP"
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Email"
                          style={{ transition: "all .15s ease" }}
                        />
                      </div>
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                            Password
                         </label>
                         <div className="flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                placeholder="Password"
                                style={{ transition: "all .15s ease" }}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-0 mr-3 top-4 text-gray-600 cursor-pointer"
                             >
                             <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                             </button>
                         </div>
                    </div>
                    </form>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active-bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style={{ transition: "all .15s ease" }}
                      >
                        Sign Up
                      </button>
                    </div>
                    <div className="flex">
                    </div>
                    <div className="w-1/4 text-center">
                      <body className="text-gray-600 text-sm font-bold" style={{ margin: "0" }}>Already a member?
                      <NavLink to="/login" className="text-gray-600 text-sm font-bold" style={{ color: "green", margin: "10px" }}>
                        Login
                      </NavLink>
                      </body>
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
}
