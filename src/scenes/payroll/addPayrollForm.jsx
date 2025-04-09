import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

  const [step, setStep] = useState(1); // Track the current step (1: Basic Details, 2: Salary Details)

  const [employeeData, setEmployeeData] = useState({
    staff_id: "",
    start_date: "", // Date From
    end_date: "", // Date To
    present_day: null,
    pay_date: "",
    overtime: 0,
    yearly_bonus: 0,
    sales_comission: 0,
    incentives: 0,
    sss: 0,
    pag_ibig: 0,
    philhealth: 0,
    underTime: 0,
  });

  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue =
      value === "" ? "" : !isNaN(value) ? parseFloat(value) : value;

    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
    setOpenModal(true);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(employeeData);
      const response = await axios.post(
        `http://localhost:8000/api/admin/store-staff-payroll/${employeeData.staff_id}`,
        {
          staff_id: employeeData.staff_id,
          start_date: employeeData.start_date,
          end_date: employeeData.end_date,
          pay_date: employeeData.pay_date,
          over_time: employeeData.overtime,
          yearly_bonus: employeeData.yearly_bonus,
          sales_comission: employeeData.sales_comission,
          incentives: employeeData.incentives,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const payrollData = response.data.data;
        onAddEmployee(payrollData);
        // navigate("/payslip", { state: { employeeData } });
        console.log("response.data", payrollData);
        closeModal();
        handleCloseModal();
        handleViewPayslip(payrollData);
      } else {
        console.error("Failed to store payroll data:", response);
      }
    } catch (error) {
      console.error("Error storing payroll data:", error);
    }
  };

  const handleCloseModal = () => {
    setStep(0);
    setOpenModal(false);
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
                  <MenuItem value={employee.id}>{employee.name}</MenuItem>
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

      {step === 2 && (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Salary Inclusion</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={6}>
                <TextField
                  label="Employee ID"
                  name="staff_id"
                  value={employeeData.staff_id}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                {/* <TextField
                  label="Present Days"
                  name="present_day"
                  value={employeeData.end_date - employeeData.start_date}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                /> */}
                <TextField
                  label="Payment Date"
                  name="pay_date"
                  value={employeeData.pay_date || ""}
                  onChange={handleChange}
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            {/* <Box mt={2}>
              <Typography variant="h6" padding={2}>
                Earnings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Overtime"
                    name="overtime"
                    value={employeeData.overtime || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Yearly Bonus"
                    name="yearly_bonus"
                    value={employeeData.yearly_bonus || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Sales Commission"
                    name="sales_comission"
                    value={employeeData.sales_comission || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Taripa Incentives"
                    name="incentives"
                    value={employeeData.incentives || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={2}>
              <Typography variant="h6" padding={2}>
                Deductions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="SSS"
                    name="sss"
                    value={employeeData.sss || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pag-IBIG"
                    name="pag_ibig"
                    value={employeeData.pag_ibig || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="PhilHealth"
                    name="philhealth"
                    value={employeeData.philhealth || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="UnderTime"
                    name="underTime"
                    value={employeeData.underTime || ""}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
              </Grid>
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBack} color="info">
              Back
            </Button>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="secondary"
              disabled={!employeeData.pay_date}
            >
              Save and Go to Payslip
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AddPayrollForm;
