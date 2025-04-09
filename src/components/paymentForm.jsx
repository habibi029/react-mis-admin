import React, { useContext, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PaymentForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const customer = state?.customer;

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handlePayment = () => {
    // const paymentDetails = {
    //   fullName: customer?.fullName || "",
    //   address: customer?.address ||"",
    //   contactNumber: customer?.contact_no ||"",
    //   email: customer?.email ||"",
    //   instructor: customer?.instructor || "",
    //   service: customer?.service || "",
    //   totalAmount: customer?.amount || "",
    // };

    // Navigate to the Payment Receipt page with payment details
    navigate("/payment-receipt", { state: { customer: customer } });
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        marginTop: 8, // Space from the top
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: colors.primary[400],
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h5" fontWeight="bold" color="secondary">
            The Gym Republic
          </Typography>
          <Typography variant="body1" mt={1}>
            5570 Paterno Street, cor. Gajigas St., P. Burgos Ave.
          </Typography>
          <Typography variant="body1">(Behind Seven Eleven)</Typography>
          <Typography variant="body1">Cavite City</Typography>
          <Typography variant="body1" mt={2}>
            <strong>The Gym Republic Cavite City</strong>
          </Typography>
          <Typography variant="body1" mt={1}>
            <strong>0935-113-7561</strong>
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Form Details */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Full name:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {customer?.fullname || ""}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Address:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {customer?.address || ""}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Contact Number:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {customer?.contact_no || ""}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Email Address:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{customer?.email || ""}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Instructor:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {customer?.instructor || ""}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Services:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{customer?.plan || ""}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Total Amount:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {customer?.amount || ""}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            marginTop="10px"
            variant="contained"
            color="success"
            size="large"
            onClick={handlePayment}
          >
            Payment
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default PaymentForm;
