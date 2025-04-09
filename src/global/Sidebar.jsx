import { useState } from "react";
import { Menu, MenuItem, ProSidebarProvider } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SummarizeOutlined from "@mui/icons-material/SummarizeOutlined";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [showCustomerOptions, setShowCustomerOptions] = useState(false);
  const toggleCustomerOptions = () => {
    setShowCustomerOptions((prev) => !prev); // Toggle sub-menu visibility
  };
  const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
  const toggleEmployeeOptions = () => {
    setShowEmployeeOptions((prev) => !prev); // Toggle sub-menu visibility
  };

  const [showInventoryOptions, setShowInventoryOptions] = useState(false);
  const toggleInventoryOptions = () => {
    setShowInventoryOptions((prev) => !prev); // Toggle sub-menu visibility
  };

  const [showSettingsOptions, setShowSettingsOptions] = useState(false);
  const toggleSettingsOptions = () => {
    setShowSettingsOptions((prev) => !prev); // Toggle sub-menu visibility
  };
  const [showArchiveOptions, setShowArchiveOptions] = useState(false);
  const toggleArchiveOptions = () => {
    setShowArchiveOptions((prev) => !prev); // Toggle sub-menu visibility
  };

  const [showReportOptions, setShowReportOptions] = useState(false);
  const toggleReportOptions = () => {
    setShowReportOptions((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleSelect = (title, path) => {
    setSelected(title);
    navigate(path);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[300]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebarProvider collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h2" color={colors.grey[100]}>
                  Adminis
                </Typography>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={"30px"}
                marginRight={"10px"}
              ></Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={() => handleSelect("Dashboard", "/dashboard")}
            />

            {/*Customer */}
            <Item
              title="Customer"
              to="/"
              icon={<PeopleAltOutlinedIcon />}
              selected={selected === "/"}
              setSelected={() => {
                handleSelect("/");
                toggleCustomerOptions();
              }}
            />

            {showCustomerOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Customer List"
                  to="/customer"
                  selected={selected === "/customer"}
                  setSelected={() => handleSelect("Customer List", "/customer")}
                />
                <Item
                  title="Daily"
                  to="/daily"
                  selected={selected === "/daily"}
                  setSelected={() => handleSelect("Daily", "/daily")}
                />
                <Item
                  title="Monthly"
                  to="/monthlye"
                  selected={selected === "/monthly"}
                  setSelected={() => handleSelect("Monthly", "/monthly")}
                />
              </div>
            )}

            {/*Employee */}
            <Item
              title="Employees"
              to="/"
              icon={<BadgeOutlinedIcon />}
              selected={selected === "/"}
              setSelected={() => {
                handleSelect("/");
                toggleEmployeeOptions();
              }}
            />
            {showEmployeeOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Attendance"
                  to="/employeeAttendance"
                  selected={selected === "/"}
                  setSelected={() =>
                    handleSelect("Attendance", "/employeeAttendance")
                  }
                />
                <Item
                  title="Employee List"
                  to="/employee"
                  selected={selected === "/employee"}
                  setSelected={() => handleSelect("Employee ", "/employee")}
                />
                <Item
                  title="Employee Position"
                  to="/employee-position"
                  selected={selected === "/employee-position"}
                  setSelected={() =>
                    handleSelect("Employee ", "/employee-position")
                  }
                />
              </div>
            )}
            <Item
              title="Payroll"
              to="/payroll-list"
              icon={<AccountBalanceWalletIcon />}
              selected={selected}
              setSelected={() => handleSelect("Payroll List", "/payroll-list")}
            />

            {/* Products */}
            {/* <Item
              title="Products"
              to="/products"
              icon={<ShoppingCartIcon />}
              selected={selected}
              setSelected={() => handleSelect("Products", "/products")}
            /> */}

            {/* Services */}
            <Item
              title="Services"
              to="/services"
              icon={<FitnessCenterIcon />}
              selected={selected}
              setSelected={() => handleSelect("Services", "/services")}
            />

            {/*Inventory */}
            <Item
              title="Stocks"
              to="/"
              icon={<InventoryIcon />}
              selected={selected === "/"}
              setSelected={() => {
                handleSelect("/");
                toggleInventoryOptions();
              }}
            />
            {showInventoryOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Inventory Form"
                  to="/inventoryform"
                  selected={selected === "/inventoryform"}
                  setSelected={() =>
                    handleSelect("Inventory Form", "/inventoryform")
                  }
                />
                <Item
                  title="Equipments"
                  to="/equipment-table"
                  selected={selected === "/equipment-table"}
                  setSelected={() =>
                    handleSelect("Equipments", "/equipment-table")
                  }
                />
                <Item
                  title="Products"
                  to="/product-table"
                  selected={selected === "/product-table"}
                  setSelected={() => handleSelect("Products", "/product-table")}
                />
              </div>
            )}

            {/*Reports */}
            <Item
              title="Reports"
              to="/"
              icon={<SummarizeOutlined />}
              selected={selected === "/"}
              setSelected={() => {
                handleSelect("/");
                toggleReportOptions();
              }}
            />
            {showReportOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Sales"
                  to="/sales-report"
                  selected={selected}
                  setSelected={() =>
                    handleSelect("Sales Report", "/sales-report")
                  }
                />
                <Item
                  title="Inventory"
                  to="/inventory-report"
                  selected={selected === "/inventory-report"}
                  setSelected={() =>
                    handleSelect("Inventory Report", "/inventory-report")
                  }
                />
              </div>
            )}

            {/*Settings */}
            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={selected === "/settings"}
              setSelected={() => {
                handleSelect("/settings");
                toggleSettingsOptions();
              }}
            />
            {showSettingsOptions && (
              <div style={{ paddingLeft: "20px" }}>
                <Item
                  title="Archive"
                  to="/"
                  selected={selected === "/"}
                  setSelected={() => {
                    handleSelect("/settings");
                    toggleArchiveOptions();
                  }}
                />
                {showArchiveOptions && (
                  <div style={{ paddingLeft: "20px" }}>
                    <Item
                      title="Customer"
                      to="/customerarchive"
                      selected={selected === "/customerarchive"}
                      setSelected={() =>
                        handleSelect("Customer", "/customerarchive")
                      }
                    />

                    <Item
                      title="Employee"
                      to="/employeearchive"
                      selected={selected === "/employeearchive"}
                      setSelected={() =>
                        handleSelect("Employee", "/employeearchive")
                      }
                    />
                  </div>
                )}

                {/* <Item
                  title="Account Settings"
                  to="/accountsettings"
                  selected={selected === "/accountsettings"}
                  setSelected={() =>
                    handleSelect("Account Settings", "/accountsettings")
                  }
                />
                <Item
                  title="Audit Trial "
                  to="/audittrail"
                  selected={selected === "/audittrail"}
                  setSelected={() => handleSelect("Audit Trail", "/audittrail")}
                /> */}
                <Item
                  title="Back up and Restore "
                  to="/backandrestore"
                  selected={selected === "/backandrestore"}
                  setSelected={() =>
                    handleSelect("Back up and Restore", "/backandrestore")
                  }
                />
              </div>
            )}
          </Box>
        </Menu>
      </ProSidebarProvider>
    </Box>
  );
};

export default Sidebar;
