import React, { useState, useEffect } from "react";
import basestyle from "../styles/Base.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };
  useEffect(() => {

    const token = JSON.parse(localStorage.getItem("token"));
    const uname = localStorage.getItem("username");
    if (token) {
      navigate("/" + uname + "/profile")
      return
    }
    const loginSuccess = () => {
      toast.success("Login Successful!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      });
    }

    const loginError = (message) => {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      })
    }

    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios
        .post("http://localhost:8000/login", user)
        .then((res) => {
          if (res.status === 201) {
            loginSuccess();
            localStorage.setItem("token", JSON.stringify(res.data.accessToken));
            localStorage.setItem("username", res.data.username);
            const username = res.data.username;
            navigate("/" + username + "/profile")
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            loginError("User not found.");
          } else if (error.response.status === 400) {
            loginError("Invalid credentials.");
          } else if (error.response.status === 403) {
            loginError(error.response.data.message);
          } else {
            loginError("Server Error.");
          }
        });
    }
  }, [formErrors]);
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="min-h-screen bg-gray-700 relative">
          <div
            className="absolute top-0 w-full h-full"
            style={{
              backgroundImage:
                "url(/bg2e.png)",
              backgroundSize: "contain",

            }}
          ></div>
          <div className="container mx-auto px-4 h-min">
            <div className="flex content-center items-center justify-center min-h screen mt-8">
              <div className="w-full lg:w-4/12 px-4 mt-24 mb-8">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                      <h6 className="text-gray-600 text-sm font-bold">
                        Sign in with
                      </h6>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Email"
                          onChange={onChange}
                          value={user.email}
                          style={{ transition: "all .15s ease" }}
                        />
                        <p className={basestyle.error}>{formErrors.email}</p>
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="flex items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Password"
                            name="password"
                            id="password"
                            onChange={onChange}
                            value={user.password}
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
                        <p className={basestyle.error}>{formErrors.password}</p>
                      </div>
                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            id="customCheckLogin"
                            type="checkbox"
                            className="form-checkbox border-0 rounded text-gray-800 w-5 h-5"
                            style={{ transition: "all .15s ease" }}
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            Remember me
                          </span>
                        </label>
                        <div className="float-right">
                          <Link
                            to="/forgot-password"
                            className="text-gray-300"
                            style={{ color: "blue" }}
                          >
                            <small>Forgot password?</small>
                          </Link>
                        </div>
                      </div>
                    </form>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active-bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        onClick={loginHandler}
                        style={{ transition: "all .15s ease" }}
                      >
                        Sign In
                      </button>
                    </div>
                    <div className="w-1/4 text-center">
                      <body
                        className="text-gray-600 text-sm font-bold"
                        style={{ margin: "0" }}
                      >
                        Not a member?
                        <Link
                          to="/register"
                          className="text-gray-600 text-sm font-bold"
                          style={{ color: "green", margin: "10px" }}
                        >
                          Register
                        </Link>
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

export default Login;
