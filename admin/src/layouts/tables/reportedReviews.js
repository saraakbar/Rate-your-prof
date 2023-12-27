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
    const [reports, setReports] = useState([]);
    const [columns, setColumns] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const token = JSON.parse(localStorage.getItem("token"));


    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const actionsColumn = {
        Header: 'Actions',
        accessor: 'actionsColumn', // Use a unique identifier for the accessor    
        Cell: ({ row }) => (
                <MDButton onClick={() => handleNav(row.original._id)} color="primary" size="small">
                    View Details
                </MDButton>
        ),
    };

    const handleNav= async (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    const handleClean = async () => {
        const confirm = window.confirm("Are you sure you want to delete reports?")

        if (confirm) {
            try {
                const response = await axios.delete(
                    `http://localhost:8000/admin/cleanup`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRefresh(!refresh);
            } catch (error) {
                console.error("Error deleting reports:", error);
            }
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/admin/login", { replace: true });
        }

        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/admin/reports`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const col = [
                    "_id",
                    "review._id",
                    "review.user._id",
                    "review.user.username",
                    "user._id",
                    "user.username",
                    "reason",
                    "isResolved",
                    "isDeleted",
                    "date"
                ];
    

                const reportsWithConverted = response.data.reports.map(report => ({
                    ...report,
                    isResolved: report.isResolved.toString(),
                    isDeleted: report.isDeleted.toString(),
                  }));


                setColumns(col);
                setReports(reportsWithConverted);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        


        fetchReports();
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
                                Reported reviews
                            </MDTypography>
                            <MDBox display="flex" alignItems="center" gap={2}>
                                <MDButton onClick={()=>handleClean()}>
                                    <Icon>delete_sweep</Icon>
                                </MDButton>
                                <MDButton
                                    onClick={handleRefresh} 
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
                                    rows: reports,
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
