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
import { useParams } from 'react-router-dom';

function Tables() {
    const navigate = useNavigate();
    const [dept, setDept] = useState([]);
    const [columns, setColumns] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { uni_id } = useParams();           

    const actionsColumn = {
        Header: 'Actions',
        accessor: 'actionsColumn',   
        Cell: ({ row }) => (
            <MDButton onClick={() => handleCriterias(row.original._id)} color="primary" size="small">
                View Criteria
            </MDButton>
        ),
    };

    const handleCriterias = (dept_id) => {
        console.log(dept_id)
    }


    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const handleAddDept = (uni_id) => {
        console.log("add dept to uni: ", uni_id)
    }

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            navigate("/admin/login", { replace: true });
        }

        const fetchDepts = async () => {
             try {
                const response = await axios.get(`http://localhost:8000/admin/departments/${uni_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setColumns(response.data.columns);
                setDept(response.data.depts);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepts();
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
                                    onClick={handleAddDept(uni_id)}
                                    color="inherit"
                                >
                                    <Icon>add</Icon>
                                </MDButton>
                                <MDButton
                                    onClick={handleRefresh} // Add the function to handle the refresh action
                                    color="inherit"
                                >
                                    <Icon>refresh</Icon>
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
                                    rows: dept,
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
