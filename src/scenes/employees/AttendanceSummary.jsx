import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
const AttendanceSummary = ({
  attendanceRecords = [],
  employees = [],
  selectedStaffId,
  setSelectedStaffId,
  isLoading,
  handleAbsentEmployee,
  handleLeaveEmployee, // Add this prop for Leave functionality

}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      showAlert("From date cannot be after To date", "warning");
    }
  }, [fromDate, toDate]);

  // Update the filtered records logic
 // ⬅️ Move this up
const filteredRecords = attendanceRecords.filter((record) => {
  const recordDate = dayjs(record.date);
  const matchesStaff =
    !selectedStaffId || record.staff_id === selectedStaffId.id;
  const matchesFromDate =
    !fromDate ||
    recordDate.isAfter(fromDate, "day") ||
    recordDate.isSame(fromDate, "day");
  const matchesToDate =
    !toDate ||
    recordDate.isBefore(toDate, "day") ||
    recordDate.isSame(toDate, "day");

  return matchesStaff && matchesFromDate && matchesToDate;
});
console.log("Filtered Records", filteredRecords);  // Check this output


  // Update the calculate summary function
  const calculateSummary = () => {
    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let leaveDays = 0; // New counter for leave days
    let totalHours = 0;

    filteredRecords.forEach((record) => {
      const inTime = record.clock_in_time
        ? dayjs(record.clock_in_time, "HH:mm:ss")
        : null;
      const outTime = record.clock_out_time
        ? dayjs(record.clock_out_time, "HH:mm:ss")
        : null;
    
      let hoursWorked = 0;

 // Assign attendance based on hours worked
 if (!inTime || !outTime) {
  // Only count if attendance is manually marked
  if (record.attendance === "absent") {
    absentDays++;
  } else if (record.attendance === "leave") {
    leaveDays++;
  }
  return; // Skip partial records
}


if (inTime && outTime) {
  hoursWorked = outTime.diff(inTime, "minute") / 60;
}

if (record.attendance === "present") {
  presentDays++;
} else if (record.attendance === "halfday") {
  halfDays++;
} else if (record.attendance === "leave") {
  leaveDays++;
} else {
  if (hoursWorked >= 8) {
    presentDays++;
  } else if (hoursWorked >= 3) {
    halfDays++;
  } else {
    absentDays++;
  }
}

if (hoursWorked > 0) {
  totalHours += hoursWorked;
}
});

    return {
      presentDays,
      halfDays,
      absentDays,
      leaveDays,  // Include leaveDays in the return object
      totalHours: Math.round(totalHours * 100) / 100,
    };
  };
  
  // Update the table to include more information
  <TableContainer
    component={Paper}
    sx={{ backgroundColor: colors.primary[400] }}
  >
    <Table>
      <TableBody>
        {filteredRecords.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.id}</TableCell>
            <TableCell>{dayjs(record.date).format("YYYY-MM-DD")}</TableCell>
            <TableCell>
              {record.clock_in_time
                ? dayjs(record.clock_in_time).format("HH:mm:ss")
                : "Not clocked in"}
            </TableCell>
            <TableCell>
              {record.clock_out_time
                ? dayjs(record.clock_out_time).format("HH:mm:ss")
                : "Not clocked out"}
            </TableCell>
            <TableCell>
              <Typography
                color={
                  record.attendance === "present"
                  ? "success.main"
                  : record.attendance === "halfday"
                  ? "warning.main"
                  : record.attendance === "leave"
                  ? "secondary.main"
                  : (!record.clock_in_time && !record.clock_out_time)
                  ? "error.main"
                  : "info.main"
                }
              >
               {
  record.attendance
    ? record.attendance.toUpperCase()
    : (record.clock_in_time && record.clock_out_time)
      ? (() => {
          const inTime = dayjs(record.clock_in_time, "HH:mm:ss");
          const outTime = dayjs(record.clock_out_time, "HH:mm:ss");
          const hours = outTime.diff(inTime, "hour", true);

          if (hours >= 8) return "PRESENT";
          if (hours >= 3) return "HALFDAY";
          return "ABSENT";
        })()
      : "" // No status yet if only clock-in
        }
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>;

  const summary = calculateSummary();

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box mb={2}>
        <Stack
          spacing={2}
          padding={2}
          borderRadius={1}
          backgroundColor={colors.primary[400]}
          direction={{ xs: "column", sm: "row" }}
          alignItems="flex-start"
          sx={{ width: "fit-content" }}
        >
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="select-staff-label">Select Staff Member</InputLabel>
            <Select
              labelId="select-staff-label"
              id="select-staff"
              value={selectedStaffId || ""}
              label="Select Staff Member"
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <MenuItem key={"all"} value={""}>
                <em>-- All --</em>
              </MenuItem>
              {employees.map((staff, index) => (
                <MenuItem key={staff.id} value={staff}>
                  {staff.fullname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedStaffId && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
              />
            </LocalizationProvider>
          )}
        </Stack>
      </Box>

      {selectedStaffId && (
        <>
          <Box mb={2}>
            <Paper
              elevation={3}
              sx={{ p: 3, mb: 2, backgroundColor: colors.primary[400] }}
            >
              <Typography variant="h6" gutterBottom>
                Attendance Summary
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={4}>
                <Box>
                  <Typography color="success">Present Days</Typography>
                  <Typography variant="h4">{summary.presentDays}</Typography>
                </Box>
                <Box>
                  <Typography color="error">Absent Days</Typography>
                  <Typography variant="h4">{summary.absentDays}</Typography>
                </Box>
                <Box>
                  <Typography color="warning.main">Half Days</Typography>
                  <Typography variant="h4">{summary.halfDays}</Typography>
                </Box>
                <Box>
                  <Typography color="secondary">Leave Days</Typography> {/* New section for leave */}
                  <Typography variant="h4">{summary.leaveDays}</Typography>
                </Box>
                <Box>
                  <Typography color="info">Total Hours Worked</Typography>
                  <Typography variant="h4">{summary.totalHours} hrs</Typography>
                </Box>
                </Box>
                <Box display="flex" gap={2}>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<PlayArrowIcon />}
                              onClick={handleAbsentEmployee}
                              disabled={"timeRecordingStatus" === "clock_in_time"}
                              sx={{ flex: 1 }}
                            >
                              {"none" === "clock_in_time" ? "Processing..." : "Mark Absent"}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary" // Color for leave button (you can customize this)
                              startIcon={<PlayArrowIcon />}
                              onClick={handleLeaveEmployee} // Call the function for leave
                              sx={{ flex: 1 }}
                            >
                              Mark Leave
                            </Button>
                  </Box>
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceSummary;