import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./views/Login.js";
import Register from "./views/Register.js";
import LandingPage from "./views/LandingPage.js";
import Profile from "./views/Profile.js";
import Teachers from "./views/Teachers.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <ToastContainer/>
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/:username/profile" element={<Profile />} />
        <Route path="/teachers" element={<Teachers />}/>
    </Routes>
  </BrowserRouter>
);