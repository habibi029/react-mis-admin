import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme"; // Assuming you have a theme file
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../context/AuthContext";

const ChangePassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showRepeatPassword, setShowRepeatPassword] = useState(false); // State for toggling repeat password visibility
  const [error, setError] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
  };

  const handleConfirm = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (password === repeatPassword && passwordRegex.test(password)) {
      // Simulate successful password change
      alert("Password changed successfully!");

      // Redirect to login page after successful password change
      navigate("/"); // Redirect to the login page
    } else {
      setError(true); // Show error message if validation fails
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState); // Toggle password visibility
  };

  const handleClickShowRepeatPassword = () => {
    setShowRepeatPassword((prevState) => !prevState); // Toggle repeat password visibility
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          padding: 3,
          backgroundColor: colors.primary[400],
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          error={error && !password}
          helperText={error && !password ? "Password is required" : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Repeat Password"
          type={showRepeatPassword ? "text" : "password"}
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          error={error && password !== repeatPassword}
          helperText={
            error && password !== repeatPassword ? "Passwords do not match" : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowRepeatPassword} edge="end">
                  {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" margin="normal">
          Password must:
          <ul>
            <li>be at least 8 characters long</li>
            <li>include lower and upper characters</li>
            <li>include at least one number</li>
            <li>cannot contain spaces or symbols</li>
          </ul>
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          fullWidth
        >
          Confirm
        </Button>
      </Container>
    </Box>
  );
};

export default ChangePassword;
