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

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function Tables() {
    const navigate = useNavigate();
    const [dept, setDept] = useState([]);
    const [newName, setNewName] = useState('');
    const [columns, setColumns] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { uni_id } = useParams();
    const token = JSON.parse(localStorage.getItem("token"));
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const onChange = (e) => {
        setNewName(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const actionsColumn = {
        Header: 'Actions',
        accessor: 'actionsColumn',
        Cell: ({ row }) => (
            <MDBox pt={3} display="flex" gap={2}>
                <MDButton onClick={() => handleCriterias(row.original._id)} color="primary" size="small">
                    View Criteria
                </MDButton>
                <MDButton onClick={() => handleCreateTeacher(row.original._id)} color="warning" size="small">
                    Add Teacher
                </MDButton>
                <MDButton color="error" size="small" onClick={() => handleDelet(row.original_id)}>
                    <Icon>delete</Icon>
                </MDButton>
            </MDBox>
        ),
    };


    const handleDelet = (dept_id) => {
        const confirm = window.confirm("Are you sure you want to delete this department?")
        if (confirm){
            console.log(dept_id)
        } 
    }

    const handleCreateTeacher = (dept_id) => {
        console.log(dept_id)
    }

    const handleCriterias = (department) => {
        navigate(`/universities/dept/${department}/criterias`);
    }

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const handleAddDept = async (uni_dept) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/admin/create_department`,
                { name: newName, uni_id: uni_dept }, // Pass the department name in the request payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error adding department:", error);
        }

        handleClose()
    }

    useEffect(() => {
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
                                Departments
                            </MDTypography>
                            <MDBox display="flex" alignItems="center" gap={2}>
                                <React.Fragment>
                                    <MDButton
                                        onClick={handleClickOpen}
                                        color="inherit"
                                    >
                                        <Icon>add</Icon>
                                    </MDButton>
                                    <Dialog open={open} onClose={handleClose}>
                                        <DialogTitle>Create Department</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="name"
                                                label="Department Name"
                                                type="name"
                                                fullWidth
                                                variant="standard"
                                                onChange={onChange}
                                            />
                                        </DialogContent>
                                        <DialogActions style={{ justifyContent: 'center' }}>
                                            <MDButton onClick={() => handleAddDept(uni_id)} color="info">Add</MDButton>
                                        </DialogActions>
                                    </Dialog>
                                </React.Fragment>
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