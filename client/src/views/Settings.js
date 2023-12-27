import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar2";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavTab from "../components/NavTab";
import basestyle from "../styles/Base.module.css";

const Settings = () => {
  const navigate = useNavigate();
  const fName = localStorage.getItem('firstName');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const validateForm = (userData) => {
    const errors = {};
    const emailRegex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!userData.firstName.trim()) {
      errors.firstName = 'First Name required';
    }

    if (!userData.lastName.trim()) {
      errors.lastName = 'Last Name required';
    }

    const usernameRegex = /^(?=.{4})[a-z][a-z\d]*_?[a-z\d]+$/i;

    if (!userData.username.trim()) {
      errors.username = 'Username required';
    } else if (!usernameRegex.test(userData.username)) {
      errors.username = "Invalid username";
    }

    if (!userData.email.trim()) {
      errors.email = 'Email required';
    } else if (!emailRegex.test(userData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!userData.erp) {
      errors.erp = "ERP is required";
      console.log(userData.erp)
    } else if (String(userData.erp).length !== 5) {      
      errors.erp = "Invalid ERP";
    } else if (!/^[0-9]+$/.test(userData.erp)) {
      errors.erp = "Invalid ERP";
    }

    return errors;
  };
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    erp: '',
  });

  const settingsError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    })
  }
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          settingsError("Invalid or expired token")
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("firstName");
          navigate("/login", { replace: true });
        }
        else {
          settingsError(error.response.data.message);
        }
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const update = async () => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      try {
        const response = await axios.patch('http://localhost:8000/settings', userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Settings updated", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
        });
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 403) {
          settingsError("Invalid or expired token")
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("firstName");
          navigate("/login", { replace: true });
        } else {
          settingsError(error.response.data.message);
        }
      }
    }
  }

    update();
  }, [formErrors]);

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm(userData);
    setFormErrors(errors);
    setIsSubmit(true);
  };

  const handleTabClick = (tab) => {
    navigate(`/${tab}`);
  };

  const bodyStyle = {
    backgroundImage: 'url("/bg2e.png")',
    backgroundSize: 'contain',
    backgroundColor: "#374151",
    minHeight: '100vh',
  };

  return (
    <>
      <Navbar transparent fName={fName} />
      <main>
        <section className="min-h-screen relative" style={bodyStyle}>
          <div className="container mx-auto px-4 h-min">
            <div className="flex content-center items-center justify-center min-h screen mt-8">
              <div className="w-full lg:w-6/12 px-4 mt-24 mb-8">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                  <div className="rounded-t px-6 mt-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold ">Account Settings</h2>
                  </div>
                  <NavTab activeTab="settings" handleTabClick={handleTabClick} />

                  <div className="px-6 ">
                    <span className="font-bold text-gray-700 text-lg">Profile </span>

                    <form>
                      <div className="mb-3">
                        <label htmlFor="firstName" className="mt-4 block text-sm font-bold text-gray-700">First Name:</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.firstName}</p>

                      </div>

                      <div className="mb-3">
                        <label htmlFor="lastName" className="block text-sm font-bold text-gray-700">Last Name:</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.lastName}</p>

                      </div>

                      <div className="mb-3">
                        <label htmlFor="username" className="block text-sm font-bold text-gray-700">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={userData.username}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.username}</p>

                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.email}</p>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="erp" className="block text-sm font-bold text-gray-700">ERP:</label>
                        <input
                          type="text"
                          id="erp"
                          name="erp"
                          value={userData.erp}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.erp}</p>
                      </div>
                    </form>
                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="hover:bg-emerald-500 hover:text-white mb-8 bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700"
                      >
                        Save Changes
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

export default Settings;
