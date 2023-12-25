// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

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
  const { department } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));
  const [criteriaList, setCriteriaList] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionsColumn = {
    Header: 'Actions',
    accessor: 'actionsColumn',
    Cell: ({ row }) => (
      <MDButton color="error" size="small" onClick={() => handleDelete(row.original._id)}>
        <Icon>delete</Icon>
      </MDButton>
    ),
  };

  const handleDelete = async (criteria_id) => {
    const confirm = window.confirm("Are you sure you want to delete this criteria?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:8000/admin/criteria/unassign/${department}/${criteria_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRefresh(!refresh)

      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCriteria([]);
  };



  const handleAddCriteria = async () => {
    try {
      await axios.post(`http://localhost:8000/admin/criteria/assign/${department}`, { criteriaIds: selectedCriteria }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
    handleCloseModal();
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
    }

    const fetchAllCriteria = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/criteria/${department}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCriteriaList(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchCriteria = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/criteria/dept/${department}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extract columns from the response
        const columns = response.data.columns.map((col) => ({
          Header: col,
          accessor: col,
        }));

        // Extract criteria data from the response
        const criteriaData = response.data.criteria;

        setColumns([...columns, actionsColumn]); // Include actionsColumn in columns
        setDept(criteriaData); // Set criteria data as rows
      } catch (error) {
        console.error("Error fetching criteria:", error);
      }
    };

    fetchCriteria();
    fetchAllCriteria();
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
                <MDButton onClick={handleOpenModal} color="inherit">
                  <Icon>add</Icon>
                </MDButton>
                <MDButton onClick={handleRefresh} color="inherit">
                  <Icon>refresh</Icon>
                </MDButton>
              </MDBox>
            </MDBox>

            <MDBox pt={3}>
              <DataTable
                table={{
                  columns: [
                    ...columns,
                  ],
                  rows: dept,
                }}
              />
            </MDBox>
          </Card>
        </Grid>
      </MDBox>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle >Select Criteria</DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel>Criteria</InputLabel>
            <Select
              input={<OutlinedInput label="Criteria" />}
              multiple
              value={selectedCriteria}
              onChange={(e) => setSelectedCriteria(e.target.value)}
              renderValue={(selected) => selected.map(id => criteriaList.find(c => c._id === id)?.name).join(", ")}
              style={{ minWidth: "200px", minHeight: "45px" }}
            >
              {criteriaList.map((criteria) => (
                <MenuItem key={criteria._id} value={criteria._id}>
                  <Checkbox checked={selectedCriteria.includes(criteria._id)} />
                  <ListItemText primary={criteria.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAddCriteria}>Add</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
