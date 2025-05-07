import React, { useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { AuthContext } from "../../context/AuthContext";

const PaySlip = ({ selectedEmployee, handlePayslipClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => { 
    const doc = new jsPDF({ orientation: "portrait" });
    const marginX = 20;
    let yPos = 5;  // Adjusted position to move the logo higher
    const columnWidth = 120;

    if (!selectedEmployee) {
        alert("No employee selected!");
        return;
    }

    // Header Section with Logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // Add Logo (Replace with your Base64 logo string)
    const logoUrl = "logo.png"; // Replace with your Base64 logo string
    doc.addImage(logoUrl, "PNG", marginX, yPos - 2, 20, 20); // Position logo and adjust size

    // Add text next to the logo
    doc.text("THE GYM REPUBLIC CAVITE CITY", marginX + 30, yPos + 8);
    doc.setFontSize(9);
    doc.text("5570 Paterno Street, cor. Cajigas St. P. Burgos Ave.", marginX + 30, yPos + 12);

    yPos += 12;
    doc.setFontSize(14);
    doc.text("PAY SLIP", marginX + columnWidth, yPos + 5, { align: "center" });
    
    yPos += 10;
    doc.line(marginX, yPos, marginX + columnWidth, yPos);
    
    // Employee Information
    yPos += 10;
    doc.setFontSize(10);
    doc.text("Employee:", marginX, yPos);
    doc.text(selectedEmployee.name || "N/A", marginX + 40, yPos);
    
    yPos += 6;
    doc.text("Employee No.#:", marginX, yPos);
    doc.text(`EMP${String(selectedEmployee.id).padStart(3, "0")}`, marginX + 40, yPos);
    
    yPos += 6;
    doc.text("Payroll Period:", marginX, yPos);
    doc.text(getDateRange(selectedEmployee?.start_date, selectedEmployee?.end_date), marginX + 40, yPos);
    
    yPos += 10;
    doc.line(marginX, yPos, marginX + columnWidth, yPos);
    
    // Attendance Summary
    yPos += 10;
    doc.text("Attendance Summary", marginX, yPos);
    doc.line(marginX, yPos + 2, marginX + 50, yPos + 2);
    yPos += 6;
    doc.text("Type", marginX, yPos);
    doc.text("Days", marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Present", marginX, yPos);
    doc.text(String(selectedEmployee.present_days || 0), marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Absent", marginX, yPos);
    doc.text(String(selectedEmployee.absents || 0), marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Half Day", marginX, yPos);
    doc.text(String(selectedEmployee.half_days || 0), marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Whole Day", marginX, yPos);
    doc.text(String(selectedEmployee.whole_days || 0), marginX + columnWidth, yPos, { align: "right" });
    
    yPos += 10;
    doc.line(marginX, yPos, marginX + columnWidth, yPos);
    
    // Salary Breakdown
    yPos += 10;
    doc.text("Salary Breakdown", marginX, yPos);
    doc.line(marginX, yPos + 2, marginX + 50, yPos + 2);
    yPos += 6;
    doc.text("Type", marginX, yPos);
    doc.text("Amount", marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Salary Rate", marginX, yPos);
    doc.text(`P ${selectedEmployee.salary_rate || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Whole Day Pay", marginX, yPos);
    doc.text(`P ${selectedEmployee.whole_day_pay || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Half Day Pay", marginX, yPos);
    doc.text(`P ${selectedEmployee.half_day_pay || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Total Salary", marginX, yPos);
    doc.text(`P ${selectedEmployee.total_salary || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    
    yPos += 10;
    doc.line(marginX, yPos, marginX + columnWidth, yPos);
    
    // Deductions
    yPos += 10;
    doc.text("Deductions", marginX, yPos);
    doc.line(marginX, yPos + 2, marginX + 50, yPos + 2);
    yPos += 6;
    doc.text("Type", marginX, yPos);
    doc.text("Amount", marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("SSS", marginX, yPos);
    doc.text(`P ${selectedEmployee.sss || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("PhilHealth", marginX, yPos);
    doc.text(`P ${selectedEmployee.philhealth || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Pag-IBIG", marginX, yPos);
    doc.text(`P ${selectedEmployee.pagibig || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    yPos += 6;
    doc.text("Total Deductions", marginX, yPos);
    doc.text(`P ${selectedEmployee.total_deductions || "0.00"}`, marginX + columnWidth, yPos, { align: "right" });
    
    yPos += 15;
    doc.setFontSize(14);
    doc.text(`NET PAY: P ${selectedEmployee.final_salary || "0.00"}`, marginX + columnWidth / 2, yPos, { align: "center" });
    
    doc.save("payslip.pdf");
};

  const formatDate = (date) => {
    if (!date) return "--";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "--";
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const deductionDate = (isMonthEnd = false, deductionRate) => {
    const date = new Date(selectedEmployee?.start_date);
    const day = isMonthEnd ? 30 : 15;

    if (Number(deductionRate) > 0) {
      return `(${date.toLocaleString("default", {
        month: "long",
      })} ${day}, ${date.getFullYear()})`;
    }

    return "";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
        <Box px={4} py={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            backgroundColor={colors.primary[300]}
            sx={{
              // backgroundColor: "#333",
              color: "white",
              padding: "8px 16px",
            }}
          >
            PAY SLIP
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Payroll Period:{" "}
                {getDateRange(
                  selectedEmployee?.start_date,
                  selectedEmployee?.end_date
                )}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "black", padding: "22px 16px" }}
              >
                Employer: GYM Republic
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Name of Employee: {selectedEmployee.name}
              </Typography>
              <Typography color="primary" paddingLeft={"1rem"}>
                Employee No.#:{" "}
                {"EMP" + selectedEmployee.id.toString().padStart(3, "0")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Date of Payment:
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#333",
                  padding: "22px 16px",
                }}
              >
                {formatDate(selectedEmployee?.pay_date)}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Mode of Payment: Cash
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box p={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
                Attendance Summary
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                        Type
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        Days
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Present</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.present_days}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Absent</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.absents}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Half Day</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.half_days}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Whole Day</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.whole_days}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
                Salary Breakdown
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                        Type
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Salary Rate</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.salary_rate}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Whole Day</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.whole_day_salary}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333" }}>Half Day</TableCell>
                      <TableCell align="right" sx={{ color: "#333" }}>
                        {selectedEmployee.half_day_salary}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                        Total Salary
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {selectedEmployee.net_income}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
              Deductions
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                      Type
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: "#333" }}>
                      SSS {deductionDate(false, selectedEmployee.sss_rate)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#333" }}>
                      {selectedEmployee.sss}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "#333" }}>
                      PhilHealth{" "}
                      {deductionDate(true, selectedEmployee.philhealth)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#333" }}>
                      {selectedEmployee.philhealth}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "#333" }}>
                      Pag-IBIG {deductionDate(true, selectedEmployee.pag_ibig)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#333" }}>
                      {selectedEmployee.pag_ibig}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "#333" }}>
                      <strong>Total Deductions</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#333" }}>
                      <strong>{selectedEmployee.total_deductions}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Divider />

        <Box
          p={4}
          textAlign="center"
          sx={{ color: "#333", paddingTop: "20px", marginTop: "15px" }}
        >
          <Typography variant="h5" fontWeight="bold">
            NET PAY.....P {selectedEmployee.final_salary}
          </Typography>
        </Box>
      </Paper>

      {/* Buttons moved outside the main Box */}
      <Box
        className={"no-print"}
        p={4}
        textAlign="center"
        sx={{ marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handlePrint}
        >
          Print
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mr: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="outlined" color="error" onClick={handlePayslipClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PaySlip;
