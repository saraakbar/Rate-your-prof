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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Report = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState();
  const token = JSON.parse(localStorage.getItem("token"));
  const { id } = useParams();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/review/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReview();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid item xs={12}>
          <Card mb={4}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Report
              </MDTypography>
            </MDBox>
            <MDBox p={3}>
              <div style={{ marginBottom: 16 }}>
                {reviews?.user?.username}
              </div>
              <MDTypography variant="h5" component="h3" mb={2}>
                {reviews?.teacher?.name}
              </MDTypography>
              <MDTypography variant="body1" mb={2}>
                {reviews?.course}
              </MDTypography>
              <MDTypography variant="body1" mb={4}>
                {reviews?.comment}
              </MDTypography>
              <div style={{ marginBottom: 24 }}>
                <MDTypography variant="subtitle1" fontWeight="fontWeightBold">
                  Review Details:
                </MDTypography>
                <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
                  <li>Average Rating: {reviews?.avgRating}</li>
                  <li>Date: {new Date(reviews?.date).toLocaleDateString()}</li>
                  <li>Is Grad Review: {reviews?.isGradReview ? 'Yes' : 'No'}</li>
                </ul>
              </div>
              <div>
                <MDTypography variant="subtitle1" fontWeight="fontWeightBold">
                  Criteria:
                </MDTypography>
                <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
                  {Array.isArray(reviews?.criteria) &&
                    reviews?.criteria.map((criterion) => (
                      <li key={criterion._id}>
                        {criterion?.criterion?.name}: {criterion?.rating} - {criterion?.comment}
                      </li>
                    ))}
                </ul>
              </div>
            </MDBox>
          </Card>
          <MDBox pt={3} display="flex" gap={2} >
          <MDButton color="warning" size="medium">suspend user</MDButton>
          <MDButton color="error" size="medium">delete user</MDButton>
          <MDButton color="error" size="medium">delete review</MDButton>
          <MDButton color="info" size="medium">Resolved</MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Report;