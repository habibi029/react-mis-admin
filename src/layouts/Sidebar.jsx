import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Box, IconButton, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { tokens } from "../theme";

const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const menuItemStyles = {
    button: {
      backgroundColor: colors.primary[400],
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? colors.primary[900]
            : colors.primary[500],
      },
    },
    activeButton: {
      borderLeft: `4px solid`,
    },
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <ProSidebar
      backgroundColor={colors.primary[400]}
      collapsed={!isSidebarOpen}
      width={isMobile ? "100%" : "250px"}
      collapsedWidth={isMobile ? "0px" : "80px"}
      style={{
        height: "100%",
        position: isMobile ? "fixed" : "relative",
        left: isMobile && !isSidebarOpen ? "-100%" : "0",
        transition: "all 0.3s",
        borderRight: "none",
        zIndex: isMobile ? 1000 : 1,
      }}
    >
      <Box
        backgroundColor={colors.primary[400]}
        mb={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: !isMobile ? "center" : "flex-start",
          justifyContent: !isMobile ? "center" : "flex-start",
        }}
      >
        {isSidebarOpen && !isMobile ? (
          <img
            style={{ width: "150px", height: "auto" }}
            src="/gym-republic-logo.png"
            alt="Logo"
            onClick={toggleSidebar}
          />
        ) : (
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      <Menu iconShape="square" menuItemStyles={menuItemStyles}>
        <MenuItem
          icon={<DashboardIcon />}
          component={<Link to="/dashboard" />}
          style={isActiveRoute("/dashboard") ? menuItemStyles.activeButton : {}}
          onClick={isMobile ? toggleSidebar : null}
        >
          Dashboard
        </MenuItem>
        <SubMenu icon={<PeopleIcon />} label="Customers">
          <MenuItem
            component={<Link to="/customers" />}
            style={
              isActiveRoute("/customers") ? menuItemStyles.activeButton : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Customer List
          </MenuItem>
          <MenuItem
            component={<Link to="/customers/daily" />}
            style={
              isActiveRoute("/customers/daily")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Daily Customers
          </MenuItem>
          <MenuItem
            component={<Link to="/customers/monthly" />}
            style={
              isActiveRoute("/customers/monthly")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Monthly Customers
          </MenuItem>
        </SubMenu>
        <SubMenu icon={<BadgeIcon />} label="Employees">
          <MenuItem
            component={<Link to="/employees" />}
            style={
              isActiveRoute("/employees") ? menuItemStyles.activeButton : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Employee List
          </MenuItem>
          <MenuItem
            component={<Link to="/employees/attendance" />}
            style={
              isActiveRoute("/employees/attendance")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Employee Attendance
          </MenuItem>
          <MenuItem
            component={<Link to="/employees/position" />}
            style={
              isActiveRoute("/employees/position")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Employee Position
          </MenuItem>
        </SubMenu>
        <MenuItem
          icon={<AccountBalanceWalletIcon />}
          component={<Link to="/payroll" />}
          style={isActiveRoute("/payroll") ? menuItemStyles.activeButton : {}}
          onClick={isMobile ? toggleSidebar : null}
        >
          Payroll
        </MenuItem>
        <MenuItem
          icon={<FitnessCenterIcon />}
          component={<Link to="/services" />}
          style={isActiveRoute("/services") ? menuItemStyles.activeButton : {}}
          onClick={isMobile ? toggleSidebar : null}
        >
          Services
        </MenuItem>
        <SubMenu icon={<InventoryIcon />} label="Stocks">
          <MenuItem
            component={<Link to="/stocks/create" />}
            style={
              isActiveRoute("/stocks/create") ? menuItemStyles.activeButton : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Inventory Form
          </MenuItem>
          <MenuItem
            component={<Link to="/stocks/equipments" />}
            style={
              isActiveRoute("/stocks/equipments")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Equipments
          </MenuItem>
          <MenuItem
            component={<Link to="/stocks/products" />}
            style={
              isActiveRoute("/stocks/products")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Products
          </MenuItem>
        </SubMenu>
        <SubMenu icon={<AssessmentIcon />} label="Reports">
          <MenuItem
            component={<Link to="/reports/sales" />}
            style={
              isActiveRoute("/reports/sales") ? menuItemStyles.activeButton : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Sales Report
          </MenuItem>
          <MenuItem
            component={<Link to="/reports/inventory" />}
            style={
              isActiveRoute("/reports/inventory")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Inventory Report
          </MenuItem>
        </SubMenu>
        <SubMenu icon={<SettingsIcon />} label="Settings">
          <SubMenu label="Archive">
            <MenuItem
              component={<Link to="/settings/archive/customers" />}
              style={
                isActiveRoute("/settings/archive/customers")
                  ? menuItemStyles.activeButton
                  : {}
              }
              onClick={isMobile ? toggleSidebar : null}
            >
              Customer Archive
            </MenuItem>
            <MenuItem
              component={<Link to="/settings/archive/employees" />}
              style={
                isActiveRoute("/settings/archive/employees")
                  ? menuItemStyles.activeButton
                  : {}
              }
              onClick={isMobile ? toggleSidebar : null}
            >
              Employee Archive
            </MenuItem>
          </SubMenu>
          <MenuItem
            component={<Link to="/settings/backup-and-restore" />}
            style={
              isActiveRoute("/settings/backup-and-restore")
                ? menuItemStyles.activeButton
                : {}
            }
            onClick={isMobile ? toggleSidebar : null}
          >
            Back up and Restore
          </MenuItem>
        </SubMenu>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
