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
import { Modal,TextField, Button } from "@mui/material";

function Tables() {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState([]);
    const [columns, setColumns] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = JSON.parse(localStorage.getItem("token"));
    const [criteriaId, setCriteriaId] = useState('');
    const [newCriteria, setNewCriteria] = useState({
        name: "",
        description: "",
    });

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const actionsColumn = {
        Header: "Actions",
        accessor: "actionsColumn",
        Cell: ({ row }) => (
            <MDBox display="flex" gap={2}>
                 <MDButton onClick={() => handleEdit(row.original._id)} color="warning" size="small">
                <Icon> edit </Icon>
            </MDButton>
            <MDButton onClick={() => handleDelete(row.original._id)} color="error" size="small">
                <Icon> delete </Icon>
            </MDButton>
            </MDBox>
        ),
    };

    const handleEdit = async (criteriaId) => {
        handleOpenEditModal();
        try {
            setCriteriaId(criteriaId);
            const response = await axios.get(`http://localhost:8000/admin/getcriteria/${criteriaId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response)
            setNewCriteria({
                name: response.data.name,
                description: response.data.description,
            });
        } catch(error){
            console.error(error);
        }
    }

    const handleEditCriteria = async () => {
        try {
            await axios.put(`http://localhost:8000/admin/criteria/${criteriaId}`, newCriteria, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setRefresh(!refresh);
        }
        catch (error) {
            console.error(error);
        }

        handleCloseEditModal();
    }


    const handleDelete = async (criteriaId) => {
        const confirm = window.confirm('Are you sure you want to delete this criteria?');

        if (confirm) {
            try {
                await axios.delete(`http://localhost:8000/admin/criteria/${criteriaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRefresh(!refresh);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAddCriteria = async () => {
        try {
            await axios.post(`http://localhost:8000/admin/create_criteria`, newCriteria, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRefresh(!refresh);
        }
        catch (error) {
            console.error(error);
        }

        handleCloseModal();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewCriteria({
            name: "",
            description: "",
        });
    };

    const handleCloseEditModal = () => {
        setIsEditOpen(false);
    };

    const handleOpenEditModal = () => {
        setIsEditOpen(true);
    };

    useEffect(() => {
        if (!token) {
            navigate("/admin/login", { replace: true });
        }

        const fetchCriteria = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/admin/criteria`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response)

                setColumns(response.data.columns);
                setCriteria(response.data.criteria);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchCriteria();
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
                                Criterias
                            </MDTypography>
                            <MDBox display="flex" alignItems="center" gap={2}>
                                <MDButton onClick={handleRefresh} color="inherit">
                                    <Icon>refresh</Icon>
                                </MDButton>
                                <MDButton onClick={handleOpenModal} color="inherit">
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
                                    rows: criteria,
                                }}
                            />
                        </MDBox>
                    </Card>
                </Grid>
            </MDBox>

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
                            Add Criteria
                        </MDTypography>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            value={newCriteria.name}
                            onChange={(e) => setNewCriteria({ ...newCriteria, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            value={newCriteria.description}
                            onChange={(e) => setNewCriteria({ ...newCriteria, description: e.target.value })}
                        />
                        <Button variant="contained" onClick={handleAddCriteria} style={{ color: 'white' }} >
                            Save Criteria
                        </Button>
                    </MDBox>
                    </Card>
            </Modal>


            <Modal
                open={isEditOpen}
                onClose={handleCloseEditModal}
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
                            Edit Criteria
                        </MDTypography>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            value={newCriteria.name}
                            onChange={(e) => setNewCriteria({ ...newCriteria, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            value={newCriteria.description}
                            onChange={(e) => setNewCriteria({ ...newCriteria, description: e.target.value })}
                        />
                        <Button variant="contained" onClick={handleEditCriteria} style={{ color: 'white' }} >
                            Save Criteria
                        </Button>
                    </MDBox>
                    </Card>
            </Modal>
        </DashboardLayout>
    );
}

export default Tables;
