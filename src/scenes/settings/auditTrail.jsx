import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const currentUser = "Admin";

const AuditTrail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [auditLogs, setAuditLogs] = useState([]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const logAuditTrail = (action) => {
    const date = new Date();
    const newLog = {
      id: auditLogs.length + 1,
      user: currentUser,
      action: action,
      date: formatDate(date),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("auditLogs")) || [];
    setAuditLogs(savedLogs);
  }, []);

  useEffect(() => {
    localStorage.setItem("auditLogs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "user", headerName: "User", flex: 1 },
    { field: "action", headerName: "History", flex: 2 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Audit Trail
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => logAuditTrail("User logged in")}
        >
          Log In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => logAuditTrail("User logged out")}
        >
          Log Out
        </Button>
        <Button
          variant="contained"
          onClick={() => logAuditTrail("User updated profile")}
        >
          Update Profile
        </Button>
      </Box>
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
        }}
      >
        <DataGrid rows={auditLogs} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default AuditTrail;
