import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const containerStyle = {
    minHeight: "94.4vh"
};

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get("http://localhost:8000/reset-password/" + token);
                setMessage(response.data.message);
            } catch (error) {
                console.error("Error checking reset password token:", error);
                setMessage("Error checking reset password token");
            }
        };

        checkToken();
    }, []);

    const handleResetPassword = async () => {
        try {
            // Make an API request to reset the password
            const response = await axios.post("http://localhost:8000/reset-password/" + token, {
                password: password,
                confirmPassword: confirmPassword
            });

            setMessage(response.data.message);
            navigate("/login");
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Error resetting password");
        }
    }

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
                                            {/* Password Input */}
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="block w-full p-3 bg-white rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                            {/* Confirm Password Input */}
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="mt-4 block w-full p-3 bg-white rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />

                                            {/* Reset Password Button */}
                                            <button
                                                className="mt-6 bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
                                                type="button"
                                                onClick={handleResetPassword}
                                                style={{ transition: "all .15s ease" }}
                                            >
                                                Reset Password
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

export default ResetPassword;
