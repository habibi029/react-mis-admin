import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

const BackupAndRestore = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showAlert(`Backup file successfully downloaded.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while downloading the backup!", "error");
  };

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBackup = async () => {
    setIsloading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/database/backup",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200 && response.data.file) {
        const link = document.createElement("a");
        link.href = `http://localhost:8000/storage/${response.data.file}`;
        link.download = response.data.file;
        // link.click();
        handleSuccess();
        setIsloading(false);
      } else {
        handleError();
        setIsloading(false);
      }
    } catch (error) {
      console.error("Error creating backup file:", error);
      handleError();
      setIsloading(false);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Backup and Restore"
        subtitle="Create a backup of your database"
      />

      <Paper
        elevation={3}
        sx={{ padding: 3, backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h6" gutterBottom>
          Data Backup
        </Typography>
        <Button
          style={{ minWidth: "10rem" }}
          variant="contained"
          color="primary"
          onClick={handleBackup}
          disabled={isLoading}
        >
          {isLoading ? "....." : "Download Backup"}
        </Button>
      </Paper>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default BackupAndRestore;
