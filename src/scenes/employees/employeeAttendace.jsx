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

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: 'Asia/Manila',
    });
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/show-staff", {
        headers: { Authorization: `Bearer ${authToken}` },
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

  const fetchAttendanceData = async (staffId) => {
    setIsLoading(true);
    try {
      const url = staffId
        ? `http://localhost:8000/api/admin/show-attendance-list/${staffId}`
        : `http://localhost:8000/api/admin/show-attendance-list/`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const formatted = res.data.data.map((a) => {
        const workHours = calculateWorkHours(a.clock_in_time, a.clock_out_time);

        let status = "Absent"; // Default status if no clock-in/clock-out times
        
        if (a.clock_in_time && a.clock_out_time) {
          // If both clock-in and clock-out times exist, calculate status
          if (workHours >= 8) {
            status = "Present";
          } else if (workHours >= 4 && workHours < 8) {
            status = "Halfday";
          } else {
            status = "Absent";
          }
        } else if (a.clock_in_time) {
          // If only clock-in time exists, keep status as "Clocked In" or Pending
          status = "Clocked In";  // Or "Pending" if you want
        }
        return {
          id: a.staff_id,
          name: a.fullname,
          date: a.date,
          clock_in_time: a.clock_in_time || null,
          clock_out_time: a.clock_out_time || null,
          status: a.attendance_status || status,
          staffId: a.staff_id,
        };
      });

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

   const calculateWorkHours = (clockInTime, clockOutTime) => {
    const clockIn = clockInTime ? new Date(clockInTime) : null;
    const clockOut = clockOutTime ? new Date(clockOutTime) : null;

    if (clockIn && clockOut) {
      return (clockOut - clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
    }
    return 0;
  };
  const handleAbsentEmployee = async () => {
    if (!selectedStaffId) {
      showAlert("Select employee first", "warning");
      return;
    }

    try {
      const currentDateTime = new Date();
      const requestData = {
        staff_id: selectedStaffId.id,
        fullname: selectedStaffId.fullname,
        date: formatDate(currentDateTime),
      };

      const response = await axios.post('http://localhost:8000/api/admin/mark-absent', requestData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      showAlert(response.data.message, "success");
      fetchAttendanceData(selectedStaffId.id);
    } catch (err) {
      console.error("Failed to mark absent:", err);
      showAlert("Failed to mark absent", "error");
    }
  };

  const handleLeaveEmployee = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const staffId = selectedStaffId.id;
  
    axios.post("http://localhost:8000/api/admin/mark-leave", {
      staff_id: staffId,
      date: today,
      attendance: "leave",
    })
    .then((res) => {
      // refresh attendance records or show success
    })
    .catch((err) => {
      console.error("Failed to mark leave", err);
    });
  };
  
  

   const handleClockInOut = async (type) => {
    if (!selectedStaffId) {
      showAlert("Select employee first", "warning");
      return;
    }

    const today = formatDate(new Date());
    const todayRecord = attendanceRecords.find(
      (record) => record.staff_id === selectedStaffId.id && record.date === today
    );

    if (type === "clock_out_time" && (!todayRecord || !todayRecord.clock_in_time)) {
      showAlert("Cannot clock out without clocking in first.", "warning");
      return;
    }

    const requestData = {
      staff_id: selectedStaffId.id,
      fullname: selectedStaffId.fullname,
      date: formatDate(new Date()),
      clock_type: type,
      time: formatTime(new Date()),
    };

    try {
      setTimeRecordingStatus(type);
      await axios.post("http://localhost:8000/api/admin/clockIn", requestData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      showAlert(`Clock ${type === "clock_in_time" ? "In" : "Out"} recorded successfully`, "success");
      fetchAttendanceData(selectedStaffId.id);
    } catch (err) {
      console.error("Clock In/Out failed:", err);
      showAlert("Error processing clock action", "error");
    } finally {
      setTimeRecordingStatus(null);
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

  const staffAttendance = selectedStaffId
    ? employeesAttendance.filter((r) => r.staffId === selectedStaffId)
    : [];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "clock_in_time", headerName: "Clock In", flex: 1 },
    { field: "clock_out_time", headerName: "Clock Out", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },

  ];
  const handleStaffSelection = (staffId) => {
    setSelectedStaffId(staffId);
    fetchAttendanceData(staffId.id);
  };

  // Add this after other useEffects

  useEffect(() => {
    if (!authToken) return navigate("/");
    fetchEmployees();
    fetchAttendanceData();
  }, [authToken, navigate]);


  return (
    <Box m="20px">
      <Header
        title="Employee's Attendance"
        subtitle="Records of Employee's Attendance"
      />

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
                  onClick={() => handleClockInOut("clock_in_time")}
                  disabled={timeRecordingStatus === "clock_in_time"}
                  sx={{ flex: 1 }}
                >
                  {timeRecordingStatus === "clock_in_time" ? "Processing..." : "Clock In"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={() => handleClockInOut("clock_out_time")}
                  disabled={timeRecordingStatus === "clock_out_time"}
                  sx={{ flex: 1 }}
                >
                  {timeRecordingStatus === "clock_out_time"
                    ? "Processing..."
                    : "Clock Out"}
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
          setSelectedStaffId={handleStaffSelection}
          showAlert={showAlert}
          isLoading={isLoading}
          handleAbsentEmployee={handleAbsentEmployee}
          handleLeaveEmployee={handleLeaveEmployee}

        />
      )}

      <Box
        mb={"20px"}
        height="75vh"
        sx={{ "& .MuiDataGrid-root": { border: "none" } }}
      >
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