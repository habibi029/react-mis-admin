import React, { useContext, useEffect, useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PayrollForm = ({ closeModal, onAddEmployee }) => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    from: "",
    to: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.id) formErrors.id = "Employee ID is required";
    if (!formData.title) formErrors.title = "Title is required";
    if (!formData.from) formErrors.from = "Start date is required";
    if (!formData.to) formErrors.to = "End date is required";
    if (
      formData.from &&
      formData.to &&
      new Date(formData.from) > new Date(formData.to)
    ) {
      formErrors.dateRange = "Start date cannot be later than end date";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddEmployee(formData); // Send data to parent
      closeModal(); // Close modal
    }
  };

  return (
    <Box p={3}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee ID"
              name="empid"
              value={formData.empid}
              onChange={handleChange}
              error={!!errors.empid}
              helperText={errors.empid}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="From"
              name="from"
              type="date"
              value={formData.from}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.from}
              helperText={errors.from}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="To"
              name="to"
              type="date"
              value={formData.to}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.to || !!errors.dateRange}
              helperText={errors.to || errors.dateRange}
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PayrollForm;
