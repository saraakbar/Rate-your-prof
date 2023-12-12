import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    erp: "",
    username: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const emailRegex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.firstName) {
      error.firstName = "First Name is required";
    }
    if (!values.lastName) {
      error.lastName = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      error.email = "Invalid email";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 8 ||              // Minimum length of 8 characters
      !/[a-z]/.test(values.password) ||         // At least one lowercase letter
      !/[A-Z]/.test(values.password) ||         // At least one uppercase letter
      !/[0-9]/.test(values.password)) {
      error.password = "Password should be atleast 8 characters long and must contain atleast one uppercase, one lowercase and one number";
    }
    if (!values.erp) {
      error.erp = "ERP is required";
    } else if (values.erp.length !== 5) {
      error.erp = "Invalid ERP";
    } else if (!/^[0-9]+$/.test(values.erp)) {
      error.erp = "Invalid ERP";
    }

    const usernameRegex = /^(?=.{4})[a-z][a-z\d]*_?[a-z\d]+$/i;
    if (!values.username) {
      error.username = "Username is required";
    } else if (!usernameRegex.test(values.username)) {
      error.username = "Invalid username";
    }
    return error;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {

    const registerSuccess = () => {
      toast.success("Registration Successful. Please Login.", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      });
    }

    const registerError = (message) => {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
      })
    }

    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios.post("http://localhost:8000/register", user).then((res) => {
        if (res.status === 201) {
          registerSuccess();
          navigate("/login", { replace: true });
        }
      })
        .catch((error) => {
          if (error.response.status === 409 && error.response.data === "Username taken.") {
            registerError("Username taken. Please try another.");
          } else if (error.response.status === 409 && error.response.data === "User already exists. Please login") {
            registerError("Email already registered. Please Login.");
          } else if (error.response.status === 409 && error.response.data === "ERP already exists. Please check again") {
            registerError("ERP already registered. Please Login.");
          } else {
            registerError("Server Error.");
          }
        })
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
                "url(/register_bg_2.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="container mx-auto px-4 h-min">
            <div className="flex content-center items-center justify-center min-h screen mt-8">
              <div className="w-full lg:w-6/12 px-4 mt-24 mb-8">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                      <h6 className="text-gray-600 text-sm font-bold">
                        Sign up with
                      </h6>
                    </div>
                    <hr className="mt-6 border-b-1 border-gray-400" />
                  </div>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form>
                      <div className="flex flex-wrap">
                        <div className="relative w-1/2 md:w-1/2 pr-2 mb-3">
                          <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
                            Name
                          </label>
                          <input
                            name="firstName"
                            onChange={changeHandler}
                            type="text"
                            id="first-name"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="First Name"
                            style={{ transition: "all .15s ease" }}
                          />
                          <p className={basestyle.error}>{formErrors.firstName}</p>
                        </div>

                        <div className="relative  w-1/2 md:w-1/2 pl-2 mt-4 mb-3">
                          <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
                          </label>
                          <input
                            name="lastName"
                            onChange={changeHandler}
                            type="text"
                            id="last-name"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Last Name"
                            style={{ transition: "all .15s ease" }}
                          />
                          <p className={basestyle.error}>{formErrors.lastName}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap">
                        <div className="relative w-1/2 md:w-1/2 pr-2 mb-3">
                          <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                            Username
                          </label>
                          <input
                            name="username"
                            onChange={changeHandler}
                            type="text"
                            id="username"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Username"
                            style={{ transition: "all .15s ease" }}
                          />
                          <p className={basestyle.error}>{formErrors.username}</p>
                        </div>

                        <div className="relative w-1/2 md:w-1/2 pl-2 mb-3">
                          <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="erp">
                            ERP
                          </label>
                          <input
                            type="text"
                            name="erp"
                            onChange={changeHandler}
                            id="erp"
                            className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="ERP"
                            style={{ transition: "all .15s ease" }}
                          />
                          <p className={basestyle.error}>{formErrors.erp}</p>
                        </div>
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          onChange={changeHandler}
                          id="email"
                          className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Email"
                          style={{ transition: "all .15s ease" }}
                        />
                        <p className={basestyle.error}>{formErrors.email}</p>
                      </div>
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                          Password
                        </label>
                        <div className="flex items-center">
                          <input
                            name="password"
                            onChange={changeHandler}
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
                        <p className={basestyle.error}>{formErrors.password}</p>
                      </div>
                    </form>
                    <div className="text-center mt-6">
                      <button
                        onClick={signupHandler}
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

export default Register;