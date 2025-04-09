import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Box, useTheme } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BackupAndRestore = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [days, setDays] = useState(""); // Days between reminders
  const [backupFrom, setBackupFrom] = useState(""); // Backup source folder
  const [backupTo, setBackupTo] = useState(""); // Backup destination folder
  const [restoreFrom, setRestoreFrom] = useState(""); // Restore source folder
  const [restoreTo, setRestoreTo] = useState(""); // Restore destination folder
  const [restoreImagesTo, setRestoreImagesTo] = useState(""); // Restore images folder
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleBrowse = (setter) => {
    // Placeholder for folder selection logic
    const folderPath = window.prompt("Enter folder path:");
    if (folderPath) {
      setter(folderPath);
      showSnackbar(`Folder selected: ${folderPath}`);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBackup = () => {
    if (!backupFrom || !backupTo) {
      showSnackbar("Backup paths cannot be empty!");
      return;
    }
    showSnackbar(`Backup initiated from: ${backupFrom} to: ${backupTo}`);
  };

  const handleRestore = () => {
    if (!restoreFrom || !restoreTo || !restoreImagesTo) {
      showSnackbar("Restore paths cannot be empty!");
      return;
    }
    showSnackbar(
      `Restore initiated from: ${restoreFrom} to: ${restoreTo} (Images to: ${restoreImagesTo})`
    );
  };

  const handleSaveDefaults = () => {
    showSnackbar("Default paths saved!");
  };

  const paperStyle = {
    padding: 20,
    margin: "20px auto",
    maxWidth: 1300,
    backgroundColor: colors.primary[400],
  };

  return (
    <Box m="20px">
      <Header title="Backup and Restore" subtitle="" />

      <Paper elevation={3} style={paperStyle}>
        {/* Data Backup Section */}
        <Typography variant="h6" gutterBottom>
          Data Backup
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Days between backup reminders"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              fullWidth
            >
              {[1, 7, 14, 30].map((option) => (
                <MenuItem key={option} value={option}>
                  {option} day(s)
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <Typography>Backup Database From this folder:</Typography>
            <TextField
              value={backupFrom}
              placeholder="C:\\Gym Assistant\\Backup"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrowse(setBackupFrom)}
            >
              Browse
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Typography>Backup To this folder:</Typography>
            <TextField
              value={backupTo}
              placeholder="F:\\"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrowse(setBackupTo)}
            >
              Browse
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleBackup}>
              Backup
            </Button>
          </Grid>
        </Grid>

        {/* Data Restore Section */}
        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          Data Restore
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Restore From this folder:</Typography>
            <TextField
              value={restoreFrom}
              placeholder="F:\\"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrowse(setRestoreFrom)}
            >
              Browse
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Typography>Restore Database To this folder:</Typography>
            <TextField
              value={restoreTo}
              placeholder="D:\\"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrowse(setRestoreTo)}
            >
              Browse
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Typography>Restore A-Z Images to this folder:</Typography>
            <TextField
              value={restoreImagesTo}
              placeholder="C:\\Freeimages\\"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleBrowse(setRestoreImagesTo)}
            >
              Browse
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRestore}
            >
              Restore
            </Button>
          </Grid>
        </Grid>

        {/* Save Defaults */}
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="default"
              onClick={handleSaveDefaults}
            >
              Save Defaults
            </Button>
          </Grid>
        </Grid>
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
