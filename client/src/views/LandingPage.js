import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

const containerStyle = {
  minHeight: "94.4vh"
};

export default function LandingPage() {
  const [responseFromServer, setResponseFromServer] = useState("");

  useEffect(() => {
    try {
      axios.get("http://localhost:8000/").then((res) => {
        setResponseFromServer(res.data.message);
      }, 2000); // Simulate a 2-second delay for the server response
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <Navbar transparent/>
      <main>
      <section className="min-h-screen bg-gray-700 relative">
          <div
            className="absolute top-0 w-full h-full"
            style={{
              backgroundImage: "url(/register_bg_2.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="container mx-auto px-4 h-min" style={containerStyle}>
            <div className="flex content-center items-center justify-center mt-8">
            <div className="w-full lg:w-4/12 mt-40">
              <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-gray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center">
                    <h6 className="text-gray-600 text-sm font-bold">
                      {responseFromServer}
                    </h6>
                  </div>
                  <hr className="mt-6 border-b-1 border-gray-400" />
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-center">
                    <NavLink to="/login">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        style={{ transition: "all .15s ease", marginRight: "10px" }}
                      >
                        Login
                      </button>
                    </NavLink>
                    <NavLink to="/register">
                      <button
                        className="bg-gray-900 text-white active-bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1"
                        type="button"
                        color="#64c2c1"
                        style={{ transition: "all .15s ease" }}
                      >
                        Sign Up
                      </button>
                    </NavLink>
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
