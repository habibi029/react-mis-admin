import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Badge,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useNotification } from "../context/NotificationContext";

const Topbar = ({ toggleSidebar, isMobile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { authToken, logout } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showAlert(`You successfully logged out.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while logging out!", "error");
  };

  // State for the profile menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Open and close handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout handler
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post(
        `http://localhost:8000/api/admin/logout`, // Backend logout route
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      logout();
      navigate("/");
      handleSuccess();
    } catch (error) {
      console.error("Logout failed", error);
      handleError();
    }
  };

  const { notifications, markNotificationAsRead, deleteNotification } =
    useNotification();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    handleNotificationClose();
  };

  const handleNotificationDelete = (notificationId, event) => {
    event.stopPropagation(); // Prevent triggering the read action
    deleteNotification(notificationId);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box
      display="flex"
      width={"100%"}
      justifyContent="space-between"
      p={2}
      boxShadow={1}
    >
      <Box display="flex" alignItems="center">
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        {/* LIGHT/DARK MODE */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "light" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* NOTIFICATIONS */}
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
        >
          {notifications.length === 0 ? (
            <MenuItem>No notifications</MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationRead(notification.id)}
                sx={{
                  backgroundColor: notification.isRead
                    ? "inherit"
                    : colors.primary[400],
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText primary={notification.message} />
                <ListItemIcon>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(event) =>
                      handleNotificationDelete(notification.id, event)
                    }
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </ListItemIcon>
              </MenuItem>
            ))
          )}
        </Menu>

        {/* Profile Icon with Menu */}
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/profile"); // Adjust to your profile route
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout(); // Trigger logout
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;