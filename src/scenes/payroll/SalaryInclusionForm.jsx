import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";

const SalaryInclusionForm = ({ employeeID, dateFrom, dateTo }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [presentDays, setPresentDays] = useState("");
  const [earnings, setEarnings] = useState([
    { name: "Overtime", amount: 90 },
    { name: "Yearly Bonus", amount: 150 },
    { name: "Sales Commission", amount: 50 },
    { name: "Taripa Incentives", amount: 210 },
  ]);
  const [deductions, setDeductions] = useState([
    { name: "SSS", amount: 163.13 },
    { name: "Pag-IBIG", amount: 71.5 },
    { name: "PhilHealth", amount: 25 },
    { name: "UnderTime", amount: 354 },
  ]);
  const [netSalary, setNetSalary] = useState(0);

  // Calculate total earnings and total deductions
  const totalEarnings = earnings.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const totalDeductions = deductions.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  const calculateNetSalary = () => {
    setNetSalary(totalEarnings - totalDeductions);
  };

  const saveAndGoToPayslip = () => {
    const salaryDetails = {
      employeeID,
      dateFrom,
      dateTo,
      presentDays,
      earnings,
      deductions,
      netSalary,
    };

    // Mock Save API Call (replace with real API call)
    console.log("Saving Salary Details:", salaryDetails);

    // Navigate to Payslip Page (pass state or parameters if needed)
    navigate("/payslip", { state: salaryDetails });
  };

  return (
    <Box>
      <Header title="Salary Inclusion" subtitle="Employee Salary Details" />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Salary Inclusion
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Employee ID"
              value={employeeID}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Present Days"
              value={presentDays}
              onChange={(e) => setPresentDays(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Typography variant="h6">Earnings</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earnings.map((earning, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={earning.name}
                          onChange={(e) => {
                            const newEarnings = [...earnings];
                            newEarnings[index].name = e.target.value;
                            setEarnings(newEarnings);
                          }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={earning.amount}
                          onChange={(e) => {
                            const newEarnings = [...earnings];
                            newEarnings[index].amount =
                              parseFloat(e.target.value) || 0;
                            setEarnings(newEarnings);
                          }}
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" align="right">
              Total Earnings: {totalEarnings}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Deductions</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deductions.map((deduction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={deduction.name}
                          onChange={(e) => {
                            const newDeductions = [...deductions];
                            newDeductions[index].name = e.target.value;
                            setDeductions(newDeductions);
                          }}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={deduction.amount}
                          onChange={(e) => {
                            const newDeductions = [...deductions];
                            newDeductions[index].amount =
                              parseFloat(e.target.value) || 0;
                            setDeductions(newDeductions);
                          }}
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" align="right">
              Total Deductions: {totalDeductions}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={calculateNetSalary}
            sx={{ marginRight: 2 }}
          >
            Calculate Net Salary
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={saveAndGoToPayslip}
          >
            Save and Go to Payslip
          </Button>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" align="center">
            Net Salary: {netSalary}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SalaryInclusionForm;
