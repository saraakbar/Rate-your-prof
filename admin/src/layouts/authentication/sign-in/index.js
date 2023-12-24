/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import basestyle from "./Base.module.css"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

const Basic = ({ }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const validateForm = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Username is required";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };


  const handleSignIn = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  }

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
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
        .post("http://localhost:8000/admin/login", user)
        .then((res) => {
          if (res.status === 201) {
            loginSuccess();
            localStorage.setItem("token", JSON.stringify(res.data.accessToken));
            navigate("/dashboard", { replace: true });
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            loginError("User not found.");
          } else if (error.response.status === 400) {
            loginError("Invalid credentials.");
          } else {
            loginError("Server Error.");
          }
        });
    }

  }, [formErrors])

  return (
    <BasicLayout image={bgImage}>
      <ToastContainer />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="username" name="username" label="Username" fullWidth onChange={onChange} />
              <p className={basestyle.error}>{formErrors.username}</p>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" name="password" label="Password" fullWidth onChange={onChange} />
              <p className={basestyle.error}>{formErrors.password}</p>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
