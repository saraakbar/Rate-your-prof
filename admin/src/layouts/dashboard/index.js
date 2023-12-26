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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [revCount, setRevCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reportsCount, setReporsCount] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }

    const fetchCounts = async () => {
      await axios.get(`http://localhost:8000/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setRevCount(res.data.reviews);
        setUserCount(res.data.users);
        setReporsCount(res.data.reports);
        setUnresolvedCount(res.data.unresolvedReports);
      }).catch((err) => {
        console.log(err);
      })
    }
    fetchCounts();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people_alt"
                title="Users"
                count={userCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="rate_review"
                title="Reviews"
                count={revCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="report"
                title="Reports"
                count={reportsCount}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="report"
                title="Unresolved"
                count={unresolvedCount}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
