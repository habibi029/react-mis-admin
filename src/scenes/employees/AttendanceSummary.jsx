import React, { useState, useEffect } from "react";
import {
  Box,
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { tokens } from "../../theme";

const AttendanceSummary = ({
  attendanceRecords = [],
  employees = [],
  selectedStaffId,
  setSelectedStaffId,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Filter records based on selected staff and date range
  const filteredRecords = attendanceRecords.filter((record) => {
    const recordDate = dayjs(record.date);
    const matchesStaff =
      !selectedStaffId || record.staff_id === selectedStaffId;
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

  // Calculate attendance summary (present, absent, half days, total hours)
  const calculateSummary = () => {
    if (!selectedStaffId) return { presentDays: 0, halfDays: 0, absentDays: 0, totalHours: 0 };
  
    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let totalHours = 0;
  
    filteredRecords.forEach((record) => {
      const inTime = dayjs(record.in_time);
      const outTime = dayjs(record.out_time);
  
      // Calculate hours worked for the day
      const hoursWorked = outTime.diff(inTime, "hour");
  
      // Determine attendance status based on hours worked
      if (hoursWorked >= 6) {
        presentDays++;
      } else if (hoursWorked >= 4) {
        halfDays++;
      } else {
        absentDays++;
      }
  
      totalHours += hoursWorked;
    });
  
    return { presentDays, halfDays, absentDays, totalHours };
  };

  const summary = calculateSummary();

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
              value={selectedStaffId}
              label="Select Staff Member"
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <MenuItem key={"all"} value={""}>
                <em>-- All --</em>
              </MenuItem>
              {employees.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
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
            <Paper elevation={3} sx={{ p: 3, mb: 2, backgroundColor: colors.primary[400] }}>
              <Typography variant="h6" gutterBottom>
                Attendance Summary
              </Typography>
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
                  <Typography color="info">Total Hours Worked</Typography>
                  <Typography variant="h4">{summary.totalHours} hrs</Typography>
                </Box>
              </Box>
            </Paper>

            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>IN</TableCell>
                    <TableCell>OUT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{dayjs(record.date).format("YYYY-MM-DD")}</TableCell>
                      <TableCell>{record.in_time ? dayjs(record.in_time).format("HH:mm:ss") : "N/A"}</TableCell>
                      <TableCell>{record.out_time ? dayjs(record.out_time).format("HH:mm:ss") : "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceSummary;
