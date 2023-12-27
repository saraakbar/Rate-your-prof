import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar2";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavTab from "../components/NavTab";
import basestyle from "../styles/Base.module.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const fName = localStorage.getItem('firstName');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [activeTab, setActiveTab] = useState('change-password');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const settingsError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      theme: "dark",
    });
  }

  const validateForm = (passwordData) => {
    const errors = {};

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Current Password required';
    } 

    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New Password required';
    } else if (passwordData.newPassword.trim() < 8 ||
    !/[a-z]/.test(passwordData.newPassword) ||
    !/[A-Z]/.test(passwordData.newPassword) ||
    !/[0-9]/.test(passwordData.newPassword)) {
    errors.newPassword = "Password should be atleast 8 characters long and must contain atleast one uppercase, one lowercase and one number";
  }

    if (!passwordData.confirmNewPassword.trim()) {
      errors.confirmNewPassword = 'Confirm New Password required';
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    return errors;

  }
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      navigate("/login", { replace: true });
    }

    const update = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        try {
          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.patch('http://localhost:8000/settings/password', passwordData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          toast.success("Password changed successfully", {
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
          });

          navigate('/settings');
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
      }
    }

    update()
  }, [formErrors]);

  const handleInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm(passwordData);
    setFormErrors(errors);
    setIsSubmit(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
                  <NavTab activeTab={activeTab} handleTabClick={handleTabClick} />
                  <div className="px-6">
                    <span className="font-bold text-gray-700 text-lg">Change Password </span>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="mt-4 block text-sm font-bold text-gray-700">Current Password:</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.currentPassword}</p>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700">New Password:</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.newPassword}</p>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmNewPassword" className="block text-sm font-bold text-gray-700">Confirm New Password:</label>
                        <input
                          type="password"
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          value={passwordData.confirmNewPassword}
                          onChange={handleInputChange}
                          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
                        />
                        <p className={basestyle.error}>{formErrors.confirmNewPassword}</p>
                      </div>
                    </form>
                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="hover:bg-emerald-500 hover:text-white bg-gray-700 text-white mb-8 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700"
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

export default ChangePassword;
