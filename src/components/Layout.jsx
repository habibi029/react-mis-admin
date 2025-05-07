import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../layouts/Sidebar";
import Topbar from "../global/Topbar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();

  const hideSidebarAndTopbar = [
    "/",
    "/change-password",
    "/forgot-password",
  ].includes(location.pathname);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {!hideSidebarAndTopbar && (
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {!hideSidebarAndTopbar && (
          <Topbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
        )}
        <Box
          component="main"
          sx={!hideSidebarAndTopbar ? { flexGrow: 1, overflowX: "auto" } : {}}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
