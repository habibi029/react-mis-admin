import { useContext, useEffect, useState } from "react";
import {
  Button,
  Box,
  Snackbar,
  Alert,
  useTheme,
  Skeleton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../../context/AlertContext";

const CustomerArchive = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleRestorSuccess = () => {
    showAlert(`Customer successfully restored.`, "success");
  };

  const handleDeleteSuccess = () => {
    showAlert(`Customer deleted permanently.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  useEffect(() => {
    fetchArchivedClients();
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [isFetching, setIsFetching] = useState(false);

  const [customers, setCustomers] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDelete = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to delete this customer permanently? This action cannot be undone."
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/force-delete-client/${id}`,
        null, // No need to send a payload
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Update frontend state to remove the deleted client
        handleDeleteSuccess();
        fetchArchivedClients();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      handleError();
    }
  };

  const handleRestore = async (id) => {
    try {
      const userConfirmed = confirm("Do you want to restore this customer?");
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/restore-client/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleRestorSuccess();
        fetchArchivedClients();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error restoring customer:", error);
      handleError();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  const fetchArchivedClients = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/archive-client",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        const clients = response.data.data.map((client) => ({
          id: client.id,
          name: client.fullname,
          sex: client.gender,
          email: client.email,
          contact: client.contact_no,
          address: client.address,
          chosenservices: client.chosen_services,
          instructor: client.instructor,
          plan: client.plan,
          amount: client.amount,
          isActive: client.is_active,
        }));
        setCustomers(clients);
        setIsFetching(false);
      } else {
        console.error("Failed to fetch clients");
        setIsFetching(false);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsFetching(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },
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
      <Header
        title="Customer Archive"
        subtitle="Manage Archived Customer Records"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
          rows={customers || []}
          columns={columns}
        />
      </Box>
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
  );
};

export default CustomerArchive;
