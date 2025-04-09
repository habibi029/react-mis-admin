import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Eye icons
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AccountSettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSave = () => {
    // Validate required fields
    if (!firstName || !lastName || !email || !contactNumber || !address) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate password fields if the user is changing the password
    if (showChangePassword) {
      if (!password || !newPassword || !repeatPassword) {
        alert("Please fill in all password fields.");
        return;
      }
      if (newPassword !== repeatPassword) {
        alert("New password and repeat password must match.");
        return;
      }
    }

    // If validation passes
    alert("Settings have been saved successfully!");
    console.log("Settings saved");
  };

  const toggleChangePassword = () => {
    setShowChangePassword((prev) => !prev);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      sx={{
        backgroundColor: colors.primary[400],
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Header title="Account Settings" subtitle="" />

      {/* Change Information Section */}
      <Card
        sx={{
          marginBottom: 3,
          padding: 2,
          backgroundColor: colors.primary[400],
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sex</InputLabel>
                <Select value={sex} onChange={(e) => setSex(e.target.value)}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box display="flex" justifyContent="center" style={{ marginTop: 24 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      {/* Change Password Section */}
      <Card
        sx={{
          marginBottom: 3,
          padding: 2,
          backgroundColor: colors.primary[400],
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleChangePassword}
            sx={{ marginBottom: 2 }}
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </Button>

          {showChangePassword && (
            <Grid container spacing={3}>
              {/* Current Password */}
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* New Password */}
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Repeat Password */}
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Repeat Password"
                  type={showPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box display="flex" justifyContent="center" style={{ marginTop: 24 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default AccountSettings;
