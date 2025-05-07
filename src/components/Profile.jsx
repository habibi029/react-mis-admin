import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { tokens } from "../theme";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Person, Email, Badge, Fingerprint } from "@mui/icons-material";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    user_type: "",
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/admin/auth",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setProfileData(response.data.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      <Header title="Profile" subtitle="View your profile details" />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: colors.primary[400],
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: colors.greenAccent[500],
              fontSize: "3rem",
              mb: 2,
            }}
          >
            {profileData.name.charAt(0)}
          </Avatar>
          <Typography variant="h4" gutterBottom color={colors.grey[100]}>
            {profileData.name}
          </Typography>
          <Typography variant="subtitle1" color={colors.greenAccent[500]}>
            {profileData.user_type}
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          <ProfileItem
            icon={<Person />}
            label="Name"
            value={profileData.name}
          />
          <ProfileItem
            icon={<Email />}
            label="Email"
            value={profileData.email}
          />
          <ProfileItem
            icon={<Badge />}
            label="User Type"
            value={profileData.user_type}
          />
          <ProfileItem
            icon={<Fingerprint />}
            label="ID"
            value={profileData.id}
          />
        </Grid>
      </Paper>
    </Box>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid item xs={12} sm={6}>
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            backgroundColor: colors.greenAccent[500],
            borderRadius: "50%",
            padding: 1,
            marginRight: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color={colors.grey[300]}>
            {label}
          </Typography>
          <Typography variant="body1" color={colors.grey[100]}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default Profile;
