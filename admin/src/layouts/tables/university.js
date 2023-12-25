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

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Tables() {
    const navigate = useNavigate();
    const [university, setUniversity] = useState([]);
    const [columns, setColumns] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const actionsColumn = {
        Header: 'Actions',
        accessor: 'actionsColumn', // Use a unique identifier for the accessor    
        Cell: ({ row }) => (
            <MDBox pt={3} display="flex" gap={2}>
            <MDButton onClick={() => handleDepartments(row.original._id)} color="primary" size="small">
                View Departments
            </MDButton>
            <MDButton onClick={() => handleDelete(row.original._id)} color="error" size="small"> 
            <Icon> delete </Icon>
            </MDButton>
            </MDBox>
        ),
    };

    const handleDepartments = (uni_id) => {
        navigate(`/universities/${uni_id}/dept`);
    }

    const handleDelete = async (uni_id) => {
        const confirm = window.confirm('Are you sure you want to delete this university?');

        if (confirm) {
            console.log(uni_id)
        }
    }

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const handleAddUni = () => {
    }

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
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
                                {/* Add the refresh button */}
                                <MDButton
                                    onClick={handleRefresh} // Add the function to handle the refresh action
                                    color="inherit"
                                >
                                    <Icon>refresh</Icon>
                                </MDButton>
                                <MDButton
                                    onClick={handleAddUni}
                                    color="inherit" >
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
        </DashboardLayout>
    );
}

export default Tables;
