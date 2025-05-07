import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import ChangePassword from "./components/changePassword.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";
import Customer from "./scenes/customer/index.jsx";
import Employee from "./scenes/employees/employee.jsx";
import EmployeeArchive from "./scenes/employees/employeeArchive.jsx";
import EmployeeAttendance from "./scenes/employees/employeeAttendace.jsx";
import Daily from "./scenes/customer/daily.jsx";
import Monthly from "./scenes/customer/monthly.jsx";
import InventoryForm from "./scenes/inventory/inventoryForm.jsx";
import EquipmentTable from "./scenes/inventory/equipmentTable.jsx";
import ProductTable from "./scenes/inventory/supplementTable.jsx";
import CustomerArchive from "./scenes/customer/customerArchive.jsx";
import BackupAndRestore from "./scenes/settings/backupAndRestore.jsx";
import Services from "./scenes/services/index.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
import PayrollList from "./scenes/payroll/payrollList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
import EmployeePosition from "./scenes/employees/EmployeePosition.jsx";
import Profile from "./components/Profile.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import SalesReport from "./scenes/reports/salesReport.jsx";
import InventoryReport from "./scenes/reports/inventoryReport.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    document.title = "The Gym Republic | Admin";
  }, []);

  return (
    <AuthProvider>
      <AlertProvider>
        <NotificationProvider>
          <Router>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ContentLayout
                  isSidebar={isSidebar}
                  setIsSidebar={setIsSidebar}
                />
              </ThemeProvider>
            </ColorModeContext.Provider>
          </Router>
        </NotificationProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

function ContentLayout() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/customers/daily" element={<Daily />} />
        <Route path="/customers/monthly" element={<Monthly />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employees/attendance" element={<EmployeeAttendance />} />
        <Route path="/stocks/create" element={<InventoryForm />} />
        <Route path="/stocks/equipments" element={<EquipmentTable />} />
        <Route path="/stocks/products" element={<ProductTable />} />
        <Route path="/payroll" element={<PayrollList />} />
        <Route path="/employees/position" element={<EmployeePosition />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/reports/inventory" element={<InventoryReport />} />
        <Route
          path="/settings/archive/customers"
          element={<CustomerArchive />}
        />
        <Route
          path="/settings/archive/employees"
          element={<EmployeeArchive />}
        />
        <Route
          path="/settings/backup-and-restore"
          element={<BackupAndRestore />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
