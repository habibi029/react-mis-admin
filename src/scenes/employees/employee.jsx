import { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PunchClockOutlinedIcon from "@mui/icons-material/PunchClockOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddEmployee from "./AddEmployee";
import Header from "../../components/Header";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import dayjs from "dayjs";
import { generateRandomPassword } from "../../services/utils";

const Employee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const [AddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [EditEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [adminId, setAdminId] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    attendance: "",
    in: "in",
    out: "out",
    date: new Date().toISOString().split("T")[0],
  });

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaffId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaffId(null);
  };

  const handleMenuItemClick = (action) => {
    const selectedStaff = employees.find((c) => c.id === selectedStaffId);

    if (action === "attendance") {
      handleAttendanceOpen(selectedStaff);
    } else if (action === "update") {
      handleEditOpen(selectedStaff);
    } else if (action === "archive") {
      handleArchive(selectedStaffId);
    }
    handleMenuClose();
  };

  const handleSearchBar = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ search: debouncedSearch });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearch, setSearchParams]);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  // Fetch employees from the backend

  useEffect(() => {
    const adminPosition = positions.find(
      (position) => position.name.toLowerCase() === "admin"
    );
    if (adminPosition) {
      setAdminId(adminPosition.id);
    }
  }, [positions]);

  useEffect(() => {
    if (selectedEmployee) {
      const position = getPositionObject(selectedEmployee.position);
      if (position && position.id !== adminId) {
        setSelectedEmployee((prevData) => ({
          ...prevData,
          password: generateRandomPassword(),
        }));
        setIsAdmin(false);
      } else if (position && position.id === adminId) {
        setIsAdmin(true);
        setSelectedEmployee((prevData) => ({
          ...prevData,
          password: "",
        }));
      }
    }
  }, [selectedEmployee && selectedEmployee.position]);

  const handleUpdateSuccess = () => {
    showAlert(`Employee successfully updated.`, "success");
  };

  const handleAttendanceSuccess = () => {
    showAlert(`Attendance successfully recorded.`, "success");
  };

  const handleArchiveSuccess = () => {
    showAlert(`Employee successfully archived.`, "success");
  };

  const handleError = (errorMessage = "An error occurred!") => {
    showAlert(errorMessage, "error");
  };

  const fetchEmployees = useCallback(async () => {
    try {
      setIsFetching(true);
      const query = searchParams.get("search") || "";
      const response = await axios.get(
        `http://localhost:8000/api/admin/show-staff?search=${query}`,
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
        joined_date: staff.joined_date,
      }));
      setEmployees(formattedData);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.error("Failed to fetch employees:", error);
    }
  }, [searchParams, authToken]);

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/admin/show-staff",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     const formattedData = response.data.data.map((staff) => ({
  //       id: staff.id,
  //       name: staff.fullname,
  //       email: staff.email,
  //       sex: staff.gender,
  //       phone: staff.contact_no || "N/A",
  //       address: staff.address,
  //       position: staff.position,
  //       joined_date: staff.joined_date,
  //     }));
  //     setEmployees(formattedData);
  //   } catch (error) {
  //     console.error("Failed to fetch employees:", error);
  //   }
  // };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-position",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPositions(response.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };
  useEffect(() => {
    fetchPositions();
    fetchEmployees();
  }, [searchParams, fetchEmployees]);
  const handleOpen = () => setAddEmployeeOpen(true);
  const handleClose = () => setAddEmployeeOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "position_id" && value != adminId) {
      setIsAdmin(false);
      setSelectedEmployee((prevData) => ({
        ...prevData,
        password: generateRandomPassword(),
      }));
    } else if (name === "position_id" && value == adminId) {
      setIsAdmin(true);
      setSelectedEmployee((prevData) => ({
        ...prevData,
        password: "",
      }));
    }
  };

  const handleEditOpen = (employee) => {
    const [firstname, ...lastname] = employee.name.split(" ");
    setSelectedEmployee({
      ...employee,
      firstname,
      lastname: lastname.join(" "),
      gender: employee.sex,
    });
    console.log(selectedEmployee);
    setEditEmployeeOpen(true);
  };
  const handleEditClose = () => setEditEmployeeOpen(false);

  const handleAddEmployee = (newEmployee) => {
    fetchEmployees();
  };

  const handleArchive = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to move this employee to archive?"
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/soft-delete-staff/${id}`,
        null, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleArchiveSuccess();
        fetchEmployees();
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      console.error("Error archiving employee:", error);
      handleError();
    }
  };

  const getPositionObject = (positionName) => {
    const position = positions.find(
      (position) => position.name === positionName
    );

    return position;
  };

  const handleUpdateEmployee = async () => {
    setIsLoading(true);
    const position = getPositionObject(selectedEmployee.position);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/update-staff/${selectedEmployee.id}`,
        {
          position_id: position ? position.id : null,
          firstname: selectedEmployee.firstname,
          lastname: selectedEmployee.lastname,
          email: selectedEmployee.email,
          password: selectedEmployee.password,
          address: selectedEmployee.address,
          gender: selectedEmployee.gender,
          contact_no: selectedEmployee.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      handleEditClose();
      if (response.status === 200) {
        fetchEmployees();
        handleEditClose();
        setIsLoading(false);
        handleUpdateSuccess();
      } else {
        setIsLoading(false);
        handleError();
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
      handleError();
      setIsLoading(false);
    }
  };

  const handleAttendanceOpen = (employee) => {
    setSelectedEmployee(employee);
    setAttendanceModalOpen(true);
  };

  const handleAttendanceClose = () => {
    setAttendanceModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAttendanceChange = (event) => {
    const { name, value } = event.target;
    console.log("Updated attendance data:", {
      ...attendanceData,
      [name]: value,
    });

    setAttendanceData({
      ...attendanceData,
      [name]: value, // Dynamically set the value based on the name attribute
    });
  };

  const handleAttendanceSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/store-attendance/${selectedEmployee.id}`,
        {
          staff_id: selectedEmployee.id,
          date: attendanceData.date,
          in: attendanceData.in,
          out: attendanceData.out,
          attendance: attendanceData.attendance, // Ensure this is the correct value
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      handleAttendanceClose();
      handleAttendanceSuccess();
    } catch (error) {
      console.error("Error recording attendance:", error);
      handleError(error.response.data.message || "Error recording attendance");
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "joined_date", headerName: "Joined", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="text"
            color="inherit"
            onClick={(event) => handleMenuOpen(event, params.row.id)}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedStaffId === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick("update")}>
              Update
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("archive")}>
              Archive
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Employee" subtitle="Managing the Employee Members" />
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search"
              value={search}
              onChange={handleSearchBar}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="flex-end" mb="10px">
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Employee
            </Button>
          </Box>
        </Box>
        <DataGrid
          loading={isFetching}
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
            <AddEmployee
              closeModal={handleClose}
              onAddEmployee={handleAddEmployee}
              positions={positions}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={EditEmployeeOpen}
          onClose={handleEditClose}
          fullWidth
          maxWidth="sm"
        >
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <Box display="flex" flexDirection="column" gap="1rem" mt={2}>
                <TextField
                  label="First Name"
                  value={selectedEmployee.firstname}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      firstname: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Last Name"
                  value={selectedEmployee.lastname}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      lastname: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Email"
                  value={selectedEmployee.email}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Contact No"
                  value={selectedEmployee.phone}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phone: e.target.value,
                    })
                  }
                />
                <FormControl required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    value={selectedEmployee.gender}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        gender: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl required>
                  <InputLabel>Position</InputLabel>
                  <Select
                    label="Position"
                    name="position"
                    value={selectedEmployee.position}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        position: e.target.value,
                      })
                    }
                  >
                    {positions.map((position) => (
                      <MenuItem key={position.id} value={position.name}>
                        {position.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {isAdmin && (
                  <TextField
                    label="Password"
                    type="password"
                    value={selectedEmployee.password}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        password: e.target.value,
                      })
                    }
                  />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateEmployee}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating" : "Update Employee"}
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Employee;