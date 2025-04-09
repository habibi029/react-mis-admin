import React, { useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { useLocation, useNavigate } from "react-router-dom"; // For navigation
import { AuthContext } from "../context/AuthContext";

const PaymentReceipt = () => {
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

  // Helper function to format the current date and time
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const memberName = customer?.fullname || "N/A";
  const paidDate = formatDate(new Date());
  // const lastPayment = customer?.lastPaymentDate || "N/A";
  const address = customer?.address || "N/A";

  const services = [
    { name: "Monthly with Instructor", price: "PHP 1,500" },
    { name: "Charge Per Month", price: "PHP 1,500" },
  ];

  const totalAmount = "PHP 2,700";

  // Function to navigate to the customer list
  const handleCancel = () => {
    navigate("/customer"); // Replace with the actual path of the CustomerList page
  };

  const handlePrint = () => {
    window.print(); // Opens the print dialog for the current page
  };

  return (
    <Box
      sx={{
        padding: "150px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: "10px",
            color: colors.primary[500],
          }}
        >
          Payment Receipt
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ marginBottom: "10px" }}
        >
          <Typography variant="body2" sx={{ color: colors.primary[500] }}>
            Last Payment: {lastPayment}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ marginBottom: "10px", color: colors.primary[500] }}
        >
          {address}
        </Typography>

        <Divider sx={{ marginBottom: "10px" }} />

        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            marginBottom: "5px",
            color: colors.primary[500],
          }}
        >
          Member: {memberName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ marginBottom: "10px", color: colors.primary[500] }}
        >
          Paid on: {paidDate}
        </Typography>

        <Divider sx={{ marginBottom: "10px" }} />

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Service Taken</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: colors.primary[500] }}
                >
                  Valid Update
                </TableCell>
              </TableRow>
              {services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell align="right">{service.price}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", borderTop: "2px solid black" }}
                >
                  Total Amount
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", borderTop: "2px solid black" }}
                >
                  {totalAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="body2"
          sx={{
            marginTop: "20px",
            fontStyle: "italic",
            fontSize: "0.9em",
          }}
        >
          We sincerely appreciate your promptness regarding all payments from
          your side.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handlePrint}
            sx={{
              padding: "5px 30px",
              fontWeight: "bold",
            }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancel} // Trigger navigation to CustomerList
            sx={{
              padding: "5px 30px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentReceipt;
