import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const AddPayrollForm = ({
  closeModal,
  onAddEmployee,
  handleViewPayslip,
  staffs,
}) => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [step, setStep] = useState(1); // Step 1: Employee Details, Step 2: Deduction Rates
  const [employeeData, setEmployeeData] = useState({
    staff_id: "",
    start_date: "",
    end_date: "",
    pay_date: "",
  });

  const [deductionRates, setDeductionRates] = useState({
    sss_rate: 4.5,
    philhealth_rate: 3,
    pagibig_rate: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue =
      value === "" ? "" : !isNaN(value) ? parseFloat(value) : value;

    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  const handleDeductionRateChange = (e) => {
    const { name, value } = e.target;
    setDeductionRates((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Validate dates before proceeding to next step
  const validateDates = () => {
    if (new Date(employeeData.end_date) < new Date(employeeData.start_date)) {
      alert("End date must be later than Start date.");
      return false;
    }
    return true;
  };

  // Check if all required fields are filled
  const validateForm = () => {
    if (!employeeData.staff_id) {
      alert("Please select an employee.");
      return false;
    }
    if (!employeeData.start_date || !employeeData.end_date || !employeeData.pay_date) {
      alert("Please fill in all date fields.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates() || !validateForm()) {
      return;
    }

    console.log("Payload being sent:", {
      ...employeeData,
      sss_rate: deductionRates.sss_rate,
      philhealth_rate: deductionRates.philhealth_rate,
      pagibig_rate: deductionRates.pagibig_rate,
    });

    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/store-staff-payroll/${employeeData.staff_id}`,
        {
          ...employeeData,
          sss_rate: deductionRates.sss_rate,
          philhealth_rate: deductionRates.philhealth_rate,
          pagibig_rate: deductionRates.pagibig_rate,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response);

      if (response.status === 200) {
        const payrollData = response.data.data;
        onAddEmployee(payrollData);
        handleViewPayslip(payrollData);
        closeModal();
      } else {
        console.error("Failed to store payroll data:", response);
        alert("Failed to save payroll data. Please try again.");
      }
    } catch (error) {
      console.error("Error storing payroll data:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Create New Payroll
      </Typography>

      {/* Step 1: Employee Details */}
      {step === 1 && (
        <>
          <FormControl sx={{ mt: 2 }} required>
            <InputLabel>Employee</InputLabel>
            <Select
              label="Employee"
              name="staff_id"
              value={employeeData.staff_id}
              onChange={handleChange}
            >
              {staffs &&
                staffs.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            sx={{ mt: 2 }}
            label="Date From"
            name="start_date"
            type="date"
            value={employeeData.start_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="Date To"
            name="end_date"
            type="date"
            value={employeeData.end_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="Payment Date"
            name="pay_date"
            value={employeeData.pay_date || ""}
            onChange={handleChange}
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            required
          />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (validateDates() && validateForm()) {
                  setStep(2); // Proceed to Step 2
                }
              }}
              disabled={
                !employeeData.start_date ||
                !employeeData.end_date ||
                !employeeData.staff_id ||
                !employeeData.pay_date
              }
            >
              Next: Deduction Rates
            </Button>
          </Box>
        </>
      )}

      {/* Step 2: Deduction Rates */}
      {step === 2 && (
        <>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Deduction Rates (%)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="SSS Rate"
                name="sss_rate"
                type="number"
                value={deductionRates.sss_rate}
                onChange={handleDeductionRateChange}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="PhilHealth Rate"
                name="philhealth_rate"
                type="number"
                value={deductionRates.philhealth_rate}
                onChange={handleDeductionRateChange}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Pag-IBIG Rate"
                name="pagibig_rate"
                type="number"
                value={deductionRates.pagibig_rate}
                onChange={handleDeductionRateChange}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                }}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={
                !employeeData.start_date ||
                !employeeData.end_date ||
                !employeeData.staff_id ||
                !employeeData.pay_date
              }
            >
              Save and Go to Payslip
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddPayrollForm;
