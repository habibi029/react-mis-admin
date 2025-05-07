import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { authToken, login } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    showAlert(`Welcome back, ${user || "Admin"}!`, "success");
  };

  const handleError = () => {
    showAlert("Something went wrong!", "error");
  };

  useEffect(() => {
    if (authToken) {
      navigate("/dashboard");
    }
  }, [authToken, navigate]);

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
        remember_me: rememberMe ? 1 : 0, // Pass rememberMe as a boolean flag
      });

      const { data } = response;
      // Handle successful login, save the token and redirect
      login(data.meta.access_token); // Save token via context
      console.log("Login successful:", data);
      navigate("/dashboard");
      handleSuccess(data.data.name);
      setIsLoading(false);
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login failed:", err);
      handleError();
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const paperStyle = {
    padding: 20,
    height: "28rem",
    width: 380,
    margin: "150px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnStyle = { margin: "8px 0" };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        style={{
          background: "linear-gradient(to bottom, #007bff, #0056b3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: "2rem",
          position: "relative",
          clipPath: "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)",
        }}
      >
        <img 
          src="logo.png" 
          alt="Logo" 
          style={{ width: "150px", marginBottom: "2rem" }}
        />
        <Typography variant="h4" style={{ fontWeight: "bold", marginBottom: "25rem" }}>
          The GYM Republic 
        </Typography>
        <Typography style={{ maxWidth: "400px", marginTop: "6rem" }}>
          5570 Paterno Street, cor, Cajigas St. P. Burgos Ave. Behind 7/11 public market Cavite City
        </Typography>
      </Grid>
      <Paper elevation={15} style={paperStyle}>
        <Grid align="center">
         <Avatar style={{ backgroundColor: "#007bff", marginBottom: "2rem" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">ADMIN LOGIN</Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            placeholder="Enter email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <TextField
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handlePasswordToggle}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <div style={{ marginTop: "1rem" }}>
            <Typography>
              <Link href="/forgot-password">Forgot password?</Link>
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btnStyle}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        {/* Link to Sign Up Page */}
        {/* <Typography>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            Don't have an account? Sign Up
          </Link>
        </Typography> */}
      </Paper>
    </Grid>
  );
};

export default Login;
