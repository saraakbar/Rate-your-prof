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
import Icon from "@mui/material/Icon"

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Tables() {
  const navigate = useNavigate();
  const [university, setUniversity] = useState([]);
  const [columns, setColumns] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    ID: "",
    location: "",
  });

  const actionsColumn = {
    Header: "Actions",
    accessor: "actionsColumn",
    Cell: ({ row }) => (
      <MDBox pt={3} display="flex">
        <MDButton
          onClick={() => handleDepartments(row.original._id)}
          color="primary"
          size="small"
        >
          View Departments
        </MDButton>
      </MDBox>
    ),
  };

  const handleDepartments = (uni_id) => {
    navigate(`/universities/${uni_id}/dept`);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleAddUni = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewUniversity({
      name: "",
      ID: "",
      location: "",
    });
  };

  const handleSaveUni = async () => {
    try {
      // Make an API request to add a new university
      await axios.post("http://localhost:8000/admin/create_university", newUniversity, {
        headers: {
            Authorization: `Bearer ${token}`,
            },
        });

      // Close the modal and refresh the data
      setModalOpen(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error adding university:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
    }

    const fetchUniversity = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/universities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setColumns(response.data.columns);
        setUniversity(response.data.universities);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversity();
  }, [refresh]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid item xs={12}>
          <Card>
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
                Universities
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDButton
                  onClick={handleRefresh}
                  color="inherit"
                >
                  <Icon>refresh</Icon>
                </MDButton>
                <MDButton
                  onClick={handleAddUni}
                  color="inherit"
                >
                  <Icon>add</Icon>
                </MDButton>
              </MDBox>
            </MDBox>

            <MDBox pt={3}>
              <DataTable
                table={{
                  columns: [
                    ...columns.map((col) => ({
                      Header: col,
                      accessor: col,
                    })),
                    actionsColumn,
                  ],
                  rows: university,
                }}
              />
            </MDBox>
          </Card>
        </Grid>
      </MDBox>

      {/* Modal for adding a new university */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-university-modal"
        aria-describedby="modal-to-add-new-university"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
      >
        <Card style={{ maxWidth: 400, width: '100%' }}>
          <MDBox
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <MDTypography variant="h5" color="textPrimary">
              Add New University
            </MDTypography>
            <TextField
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={newUniversity.name}
              onChange={(e) =>
                setNewUniversity({ ...newUniversity, name: e.target.value })
              }
            />
            <TextField
              label="ID"
              variant="outlined"
              margin="normal"
              fullWidth
              value={newUniversity.ID}
              onChange={(e) =>
                setNewUniversity({ ...newUniversity, ID: e.target.value })
              }
            />
            <TextField
              label="Location"
              variant="outlined"
              margin="normal"
              fullWidth
              value={newUniversity.location}
              onChange={(e) =>
                setNewUniversity({ ...newUniversity, location: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveUni}
              style={{ color: 'white' }}
            >
              Save University
            </Button>
          </MDBox>
        </Card>
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
