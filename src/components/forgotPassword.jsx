import React, { useContext, useState } from "react";
import {
  useTheme,
  Container,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    keyword1: "",
    keyword2: "",
    keyword3: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event, field) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleConfirm = async () => {
    // Validate form fields
    const newError = {
      email: !formValues.email,
      keyword1: !formValues.keyword1,
      keyword2: !formValues.keyword2,
      keyword3: !formValues.keyword3,
      newPassword: !formValues.newPassword,
      confirmPassword:
        !formValues.confirmPassword ||
        formValues.newPassword !== formValues.confirmPassword,
    };

    setError(newError);

    // Proceed only if no errors
    if (!Object.values(newError).some((value) => value)) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/reset-password/answers",
          {
            email: formValues.email,
            answer_1: formValues.keyword1,
            answer_2: formValues.keyword2,
            answer_3: formValues.keyword3,
            new_password: formValues.newPassword,
            confirm_password: formValues.confirmPassword,
          }
        );
        logout();
        alert(response.data.Message);
        navigate("/");
      } catch (error) {
        console.error("Error resetting password:", error);
        alert(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormValues({
      email: "",
      keyword1: "",
      keyword2: "",
      keyword3: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError({});
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 5,
        backgroundColor: colors.primary[400],
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <h2>Forgot Password</h2>
        <p>Enter your details to reset your password.</p>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={formValues.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={!!error.email}
            helperText={error.email ? "Email is required" : ""}
          />
        </Grid>
        {["keyword1", "keyword2", "keyword3"].map((keywordKey, index) => (
          <Grid item xs={12} key={keywordKey}>
            <TextField
              fullWidth
              label={`Secret Keyword ${index + 1}`}
              type="password"
              value={formValues[keywordKey]}
              onChange={(e) => handleInputChange(e, keywordKey)}
              error={!!error[keywordKey]}
              helperText={error[keywordKey] ? "Secret keyword is required" : ""}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formValues.newPassword}
            onChange={(e) => handleInputChange(e, "newPassword")}
            error={!!error.newPassword}
            helperText={error.newPassword ? "New password is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formValues.confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPassword")}
            error={!!error.confirmPassword}
            helperText={
              error.confirmPassword
                ? "Passwords must match and cannot be empty"
                : ""
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            sx={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: "100%" }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
