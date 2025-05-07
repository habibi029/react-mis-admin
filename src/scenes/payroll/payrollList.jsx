import { useContext, useEffect, useState } from "react";
import { Box, useTheme, Button, Dialog, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { mockDataEmployee } from "../../data/mockData";
import Header from "../../components/Header";
import AddPayrollForm from "../payroll/addPayrollForm";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Payslip from "./payslip";
import { useAlert } from "../../context/AlertContext";

const PayrollList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Payroll successfully updated.`, "success");
  };

  const handleArchiveSuccess = () => {
    showAlert(`Payroll successfully archived.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  const [AddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-staff",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const formattedData = response.data.data.map((staff) => ({
        id: staff.id,
        name: staff.fullname,
        email: staff.email,
        sex: staff.gender,
        phone: staff.contact_no || "N/A",
        address: staff.address,
        position: staff.position,
      }));
      setStaffs(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await fetchPayrollData();
        setLoading(false);
        await fetchEmployees();
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };

    initializeData();
    console.log(employees);
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const fetchPayrollData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-staff-payroll",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("payroll", response.data);

      if (response.status === 200) {
        setEmployees(response.data.data);
      } else {
        console.error("Failed to fetch payroll data:", response);
      }
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  };

  const handleOpen = () => setAddEmployeeOpen(true);
  const handleClose = () => setAddEmployeeOpen(false);
  const handlePayslipClose = () => {
    setPayslipOpen(false);
  };

  const handleArchive = async (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );

    try {
      const userConfirmed = confirm(
        "Do you want to move this customer to archive?"
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/soft-delete-payroll/${id}`,
        null, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleArchiveSuccess();
        fetchPayrollData();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting payroll data:", error);
      handleError();
    }
  };

  const handleAddEmployee = (newEmployee) => {
    fetchPayrollData();
  };

  const handleViewPayslip = (employee = null) => {
    setSelectedEmployee(employee);
    setPayslipOpen(true);
  };

  const columns = [
    { field: "id", headerName: "Employee ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "present_days", headerName: "Present Days", flex: 1 },
    { field: "total_salary", headerName: "Salary", flex: 1 },
    // { field: "overtime" || "over_time", headerName: "Overtime", flex: 1 },
    // { field: "yearly_bonus", headerName: "Yearly Bonus", flex: 1 },
    // { field: "sales_comission", headerName: "Sales Commission", flex: 1 },
    // { field: "incentives", headerName: "Incentives", flex: 1 },
    { field: "sss", headerName: "SSS", flex: 1 },
    { field: "pag_ibig", headerName: "Pag-IBIG", flex: 1 },
    { field: "philhealth", headerName: "PhilHealth", flex: 1 },
    { field: "net_income", headerName: "Net Income", flex: 1 },
    { field: "total_deductions", headerName: "Total Deductions", flex: 1 },
    { field: "final_salary", headerName: "Final Salary", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems={"center"}
          height={"100%"}
          gap="9px"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleViewPayslip(params.row)}
          >
            View Payslip
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArchiveOutlinedIcon />}
            onClick={() => handleArchive(params.row.id)}
          >
            Archive
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Payroll" subtitle="Managing the Payroll Members" />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb="10px">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            New Payroll
          </Button>
        </Box>

        <DataGrid
          loading={loading}
          checkboxSelection
          rows={employees}
          columns={columns}
        />

        <Dialog
          open={AddEmployeeOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <AddPayrollForm
              closeModal={handleClose}
              onAddEmployee={handleAddEmployee}
              payslipOpen={payslipOpen}
              handleViewPayslip={handleViewPayslip}
              handlePayslipClose={handlePayslipClose}
              staffs={staffs}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={payslipOpen} onClose={handlePayslipClose}>
          <div
            style={{
              position: "fixed",
              width: "100%",
              maxHeight: "100vh",
              inset: 0,
              overflowY: "auto",
            }}
          >
            {selectedEmployee && (
              <Payslip
                selectedEmployee={selectedEmployee}
                handlePayslipClose={handlePayslipClose}
              />
            )}
          </div>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PayrollList;
