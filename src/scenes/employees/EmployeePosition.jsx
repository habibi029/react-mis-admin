import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAlert } from "../../context/AlertContext";

const EmployeePosition = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleCreateSuccess = () => {
    showAlert(`Position successfully created.`, "success");
  };

  const handleUpdateSuccess = () => {
    showAlert(`Position successfully updated.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    id: null,
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchPositions();
    }
  }, [authToken, navigate]);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-position",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPositions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (position = { id: null, name: "" }) => {
    setCurrentPosition(position);
    setIsEditMode(!!position.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPosition({ id: null, name: "" });
    setError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentPosition({ ...currentPosition, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.post(
          `http://localhost:8000/api/admin/update-position/${currentPosition.id}`,
          { name: currentPosition.name },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        handleUpdateSuccess();
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/store-position",
          { name: currentPosition.name },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        handleCreateSuccess();
      }
      fetchPositions();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save position:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      handleError();
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" justifyContent="center">
          <Button
            variant="outlined"
            color="success"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleOpenModal(params.row)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Employee Positions" subtitle="Manage Employee Positions" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        <Box display="flex" justifyContent="flex-end" mb="10px">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
          >
            Add Position
          </Button>
        </Box>
        <DataGrid
          loading={isLoading}
          checkboxSelection
          rows={positions}
          columns={columns}
        />
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {isEditMode ? "Edit Position" : "Add Position"}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box component="form" mt={2}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={currentPosition.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mr: 2 }}
                >
                  {isEditMode ? "Update" : "Add"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EmployeePosition;
