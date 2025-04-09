import { useContext, useEffect, useState } from "react";
import { Box, useTheme, Button, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { mockDataEmployee } from "../../data/mockData";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import axios from "axios";

const EmployeeArchive = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleRestorSuccess = () => {
    showAlert(`Employee successfully restored.`, "success");
  };

  const handleDeleteSuccess = () => {
    showAlert(`Employee deleted permanently.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  useEffect(() => {
    fetchArchivedEmployees();
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [employees, setEmployees] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDelete = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to delete this employee permanently? This action cannot be undone."
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/force-delete-staff/${id}`,
        null, // No need to send a payload
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Update frontend state to remove the deleted staff
        handleDeleteSuccess();
        fetchArchivedEmployees();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      handleError();
    }
  };

  const handleRestore = async (id) => {
    try {
      const userConfirmed = confirm("Do you want to restore this employee?");
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/restore-staff/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleRestorSuccess();
        fetchArchivedEmployees();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error restoring employee:", error);
      handleError();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  const fetchArchivedEmployees = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/archive-staff",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const formattedData = response.data.data.map((staff) => ({
        id: staff.id,
        name: staff.fullname,
        email: staff.email,
        sex: staff.gender,
        phone: staff.contact_no || "N/A",
        address: staff.address,
        position: staff.position,
      }));
      setEmployees(formattedData);
      setIsFetching(false);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setIsFetching(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "joined", headerName: "Joined", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="10px" justifyContent="center">
          <Button
            variant="outlined"
            color="success"
            startIcon={<SettingsBackupRestoreOutlinedIcon />}
            onClick={() => handleRestore(params.row.id)}
          >
            Restore
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Employee" subtitle="Managing the Employee Members" />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isFetching}
          checkboxSelection
          rows={employees}
          columns={columns}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EmployeeArchive;
