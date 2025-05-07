import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Tabs,
  Tab,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../../context/AlertContext";

const InventoryForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleSuccess = () => {
    showAlert(`Inventory successfully created.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while creating the inventory!", "error");
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    short_description: "",
    quantity: 0,
    price: 0,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    console.log("Form Data to be submitted:", formData); // Log the form data
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/store-inventory",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Inventory created successfully:", response.data);
      handleClear();
      handleSuccess();
    } catch (error) {
      console.error("Error creating inventory:", error);
      handleError();
    }
  };

  const handleClear = () => {
    setFormData((prevData) => ({
      name: "",
      type: "",
      short_description: "",
      quantity: 0,
      price: 0,
    }));
  };

  return (
    <Box m="20px">
      <Header title="Inventory Form" subtitle="" />
      <Box p={2} sx={{ backgroundColor: colors.primary[400] }}>
        <Typography variant="h5" mb={2}>
          Item Details
        </Typography>
        <Tabs
          indicatorColor="secondary"
          textColor="inherit"
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
        >
          <Tab label="Item" />
          {/* <Tab label="Upload Image" /> */}
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
                <FormControl required fullWidth={true}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="equipment">Equipment</MenuItem>
                    <MenuItem value="supplement">Product</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
              
              </Grid>
            </Grid>
            <Grid container mb={2}>
              <TextField
                label="Description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                mb={2}
                required
              />
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField
                  label="Stock Level"
                  name="quantity"
                  value={formData.quantity}
                  type="number"
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Unit Price"
                  name="price"
                  value={formData.price}
                  type="number"
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="body1">
              Upload image feature coming soon...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InventoryForm;
