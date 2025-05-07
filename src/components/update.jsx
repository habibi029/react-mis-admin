import React, { useContext, useEffect, useState } from "react";
import { tokens } from "../theme";
import {
  useTheme,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";

const Update = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const servicePrices = {
    "Gym Per session": 60,
    "Gym Monthly": 750,
    "Monthly Treadmill": 550,
    "Gym + Treadmill": 1200,
    "P.I Per Session": 120,
    "P.I Monthly": 1500,
    Zumba: 70,
    Dance: 30,
    "Muay Thai": 250,
    Taekwondo: 50,
    Boxing: 60,
  };

  const [formData, setFormData] = useState({
    fullName: "",
    chosenService: "",
    currentPlan: "",
    newPlan: "",
    reason: "",
    effectiveDate: "",
    additionalComments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty required fields
    const { fullName, chosenService, currentPlan } = formData;
    if (!fullName || !chosenService || !currentPlan) {
      alert("Please fill in all the required fields before submitting.");
      return; // Prevent further execution if validation fails
    }

    console.log(formData);

    // Redirect to payment form
    navigate("/payment-form", { state: { formData } }); // Pass formData if needed
  };

  return (
    <div className="">
      <Header title="Update" subtitle="Managing updates for the customer" />
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: colors.primary[400],
          padding: "50px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Grid container spacing={3}>
          {/* Chosen Service */}
          <Grid item xs={12} sm={6}>
            <FormControl required fullWidth>
              <InputLabel>Chosen Services</InputLabel>
              <Select
                label="Chosen Services"
                name="chosenService"
                value={formData.chosenService}
                onChange={handleChange}
              >
                {Object.keys(servicePrices).map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Full Name */}
          <Grid item xs={10} sm={4}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>

          {/* Current Plan */}
          <Grid item xs={10} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Current Plan</InputLabel>
              <Select
                label="Current Plan"
                name="currentPlan"
                value={formData.currentPlan}
                onChange={handleChange}
              >
                <MenuItem value="N/A">N/A</MenuItem>
                <MenuItem value="1 Week">1 Week</MenuItem>
                <MenuItem value="2 Week">2 Week</MenuItem>
                <MenuItem value="1 Month">1 Month</MenuItem>
                <MenuItem value="2 Month">2 Month</MenuItem>
                <MenuItem value="3 Months">3 Months</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={10}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Update;
