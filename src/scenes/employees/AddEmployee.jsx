import { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { generateRandomPassword } from "../../services/utils";
import CloseIcon from "@mui/icons-material/Close";

const AddEmployee = ({ closeModal, onAddEmployee, positions }) => {
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    contact_no: "",
    email: "",
    address: "",
    position_id: 1,
    password: "",
  });

  useEffect(() => {
    const adminPosition = positions.find(
      (position) => position.name.toLowerCase() === "admin"
    );
    if (adminPosition) {
      setAdminId(adminPosition.id);
    }

    console.log(positions);
  }, [positions]);

  useEffect(() => {
    if (employeeData.position_id != adminId) {
      setEmployeeData((prevData) => ({
        ...prevData,
        password: generateRandomPassword(),
      }));
      setIsAdmin(false);
    } else if (employeeData.position_id == adminId) {
      setIsAdmin(true);
      setEmployeeData((prevData) => ({
        ...prevData,
        password: "",
      }));
    }
  }, [employeeData.position_id]);

  const handleSuccess = () => {
    showAlert(`Employee successfully added.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while adding the employee!", "error");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "position_id" && value != adminId) {
      setIsAdmin(false);
      setEmployeeData((prevData) => ({
        ...prevData,
        password: generateRandomPassword(),
      }));
    } else if (name === "position_id" && value == adminId) {
      setIsAdmin(true);
      setEmployeeData((prevData) => ({
        ...prevData,
        password: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/store-staff",
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        onAddEmployee(response.data.data);
        closeModal();
        handleSuccess();
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      handleError();
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Add New Employee
      </Typography>
      <TextField
        label="First Name"
        name="firstname"
        value={employeeData.firstname}
        onChange={handleChange}
        required
      />

      <TextField
        label="Last Name"
        name="lastname"
        value={employeeData.lastname}
        onChange={handleChange}
        required
      />

      <TextField
        label="Address"
        name="address"
        value={employeeData.address}
        onChange={handleChange}
        required
      />

      <TextField
        label="Contact Number"
        name="contact_no"
        value={employeeData.contact_no}
        onChange={handleChange}
        inputProps={{ maxLength: 11 }}
        required
        type="number"
      />

      <TextField
        label="Email"
        name="email"
        value={employeeData.email}
        onChange={handleChange}
        required
      />

      <FormControl required>
        <InputLabel>Sex</InputLabel>
        <Select
          label="Sex"
          name="gender"
          value={employeeData.gender}
          onChange={handleChange}
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
          name="position_id"
          value={employeeData.position_id}
          onChange={handleChange}
        >
          {positions.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isAdmin && (
        <TextField
          label="Password"
          name="password"
          value={employeeData.password}
          onChange={handleChange}
          required
          type="password"
        />
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Add Employee"}
      </Button>
    </Box>
  );
};

export default AddEmployee;