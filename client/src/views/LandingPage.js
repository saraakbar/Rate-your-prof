import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
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
      <main>
        <section className="absolute w-full h-full">
          <div
            className="absolute top-0 w-full h-full bg-gray-700"
            style={{
              backgroundImage: "url(/bg_5.jpg)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="container mx-auto px-4" style={containerStyle}>
            <div className="w-full lg:w-4/12">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
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
                        className="bg-teal-600 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        style={{ transition: "all .15s ease", marginRight: "10px" }}
                      >
                        Login
                      </button>
                    </NavLink>
                    <NavLink to="/register">
                      <button
                        className="bg-teal-600 text-white active-bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1"
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
        </section>
      </main>
    </>
  );
}
