import React, { useState, useContext, useEffect } from "react";
import {
  Box,  
  useTheme,
  
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAlert } from "../../context/AlertContext";
import AttendanceSummary from "./AttendanceSummary";



const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-staff",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
    

      setEmployees(response.data.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-attendance-list",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      const formattedData = response.data.data.map((attendance) => ({
        id: attendance.id,
        name: attendance.name,
        date: attendance.date,
        in: attendance.in || "N/A",
        out: attendance.out || "N/A",
      }));
  
      setEmployeesAttendance(formattedData);
      setAttendanceRecords(response.data.data); // raw data for summary
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAttendance = async () => {
    if (!selectedAttendance || !newAttendanceStatus) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/update-attendance/${selectedAttendance.id}`,
        { attendance: newAttendanceStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchAttendanceData();
      setSelectedAttendance(null);
      setNewAttendanceStatus("");
      setOpen(false);
      handleUpdateSuccess();
    } catch (error) {
      console.error("Failed to update attendance:", error);
      handleError();
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

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "in", headerName: "IN", flex: 1 },
    { field: "out", headerName: "OUT", flex: 1 },
  ];
  
  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchEmployees();
      fetchAttendanceData();
    }
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      <Header
        title="Employee's Attendance"
        subtitle="Records of Employee's Attendance"
      />
      {employees.length > 0 && (
        <AttendanceSummary
          attendanceRecords={attendanceRecords}
          employees={employees}
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={setSelectedStaffId}
          handleClickOpen={handleClickOpen}
        />
      )}
      <Box
        mb={"20px"}
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
        {!selectedStaffId && (
          <DataGrid
            loading={isLoading}
            checkboxSelection
            rows={employeesAttendance}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};

export default EmployeeAttendance;
