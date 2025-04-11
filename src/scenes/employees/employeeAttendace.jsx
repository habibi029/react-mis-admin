import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { useAlert } from "../../context/AlertContext";
import AttendanceSummary from "./AttendanceSummary";

const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [newAttendanceStatus, setNewAttendanceStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [timeRecordingStatus, setTimeRecordingStatus] = useState(null);

  const formatTime = (date) => date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/show-staff", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Fetch employees failed", err);
      if (err.response?.status === 401) {
        showAlert("Session expired. Please login again.", "error");
        navigate("/");
      } else {
        showAlert("Error fetching employees", "error");
      }
    }
  };
  

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/show-attendance-list", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const formatted = res.data.data.map((a) => ({
        id: a.id,
        name: a.staff.fullname, // Assuming staff relation is loaded
        date: a.date,
        in: a.clock_in_time ? new Date(a.clock_in_time).toLocaleTimeString() : "N/A",
        out: a.clock_out_time ? new Date(a.clock_out_time).toLocaleTimeString() : "N/A",
        staffId: a.staff_id
      }));
      
      setEmployeesAttendance(formatted);
      setAttendanceRecords(res.data.data);
    } catch (err) {
      console.error("Fetch attendance failed", err);
      if (err.response?.status === 401) {
        showAlert("Session expired. Please login again.", "error");
        navigate("/");
      } else {
        showAlert("Error fetching attendance data", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleClockInOut = async (type) => {
    if (!selectedStaffId) {
      showAlert("Select employee first", "warning");
      return;
    }
  
    const currentDateTime = new Date();
    
    const requestData = {
      staff_id: selectedStaffId,
      date: formatDate(currentDateTime),
      clock_type: type,
      time: formatTime(currentDateTime)
    };
  
    console.log('Request Data:', requestData); // Debug log
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/clock",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        }
      );
  
      console.log('Response:', response.data); // Debug log
  
      showAlert(`Clock ${type} recorded successfully`, "success");
      setTimeRecordingStatus(null);
      fetchAttendanceData();
    } catch (err) {
      console.error(`Time ${type} failed:`, err);
  
      if (err.response) {
        console.error("Server response:", err.response.data);
        showAlert(`Failed to record time ${type}: ${err.response.data.message || err.response.statusText}`, "error");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        showAlert(`Failed to record time ${type}: No response from server`, "error");
      } else {
        console.error("Error", err.message);
        showAlert(`Error: ${err.message}`, "error");
      }
    }
  };
  
  
  const handleClickOpen = (row) => {
    setSelectedAttendance(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAttendance(null);
    setNewAttendanceStatus("");
  };

  const staffAttendance = selectedStaffId ? employeesAttendance.filter((r) => r.staffId === selectedStaffId) : [];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "in", headerName: "Clock In", flex: 1 },
    { field: "out", headerName: "Clock Out", flex: 1 },
   
  ];

  // Add this after other useEffects
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (selectedStaffId) {
        fetchAttendanceData();
      }
    }, 60000); // Refresh every minute
  
    return () => clearInterval(refreshInterval);
  }, [selectedStaffId]);

  useEffect(() => {
    if (!authToken) return navigate("/");
    fetchEmployees();
    fetchAttendanceData();
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      <Header title="Employee's Attendance" subtitle="Records of Employee's Attendance" />

      <Card sx={{ mb: 3, backgroundColor: colors.primary[400] }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h5" display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1 }} />
                Current Time: {formatTime(currentTime)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleClockInOut("in")}
                  disabled={timeRecordingStatus === "in"}
                  sx={{ flex: 1 }}
                >
                  {timeRecordingStatus === "in" ? "Processing..." : "Clock In"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={() => handleClockInOut("out")}
                  disabled={timeRecordingStatus === "out"}
                  sx={{ flex: 1 }}
                >
                  {timeRecordingStatus === "out" ? "Processing..." : "Clock Out"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {employees.length > 0 && (
        <AttendanceSummary
          attendanceRecords={attendanceRecords}
          employees={employees}
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={setSelectedStaffId}
          handleClickOpen={handleClickOpen}
        />
      )}

      <Box mb={"20px"} height="75vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={employeesAttendance}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>

    
    </Box>
  );
};

export default EmployeeAttendance;
