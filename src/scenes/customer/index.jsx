import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  IconButton,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddCustomer from "./addCustomer";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import SearchIcon from "@mui/icons-material/Search";

const CustomerList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Customer successfully updated.`, "success");
  };

  const handleArchiveSuccess = () => {
    showAlert(`Customer successfully archived.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [AddCustomerOpen, setAddCustomerOpen] = useState(false);
  const [updateCustomerOpen, setUpdateCustomerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleOpen = () => setAddCustomerOpen(true);
  const handleClose = () => setAddCustomerOpen(false);

  const handleAddCustomer = (newcustomer) => {
    fetchClients();
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

  const fetchClients = useCallback(async () => {
    try {
      setIsFetching(true);
      const query = searchParams.get("search") || "";

      const response = await axios.get(
        `http://localhost:8000/api/admin/show-client?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        const clients = response.data.data.map((client) => ({
          id: client.id,
          name: client.fullname,
          sex: client.gender,
          email: client.email,
          contact: client.contact_no,
          address: client.address,
          chosenservices: client.chosen_services,
          instructor: client.instructor,
          plan: client.plan,
          amount: client.amount,
          isActive: client.is_active,
        }));
        setCustomer(clients);
        setIsFetching(false);
      } else {
        console.error("Failed to fetch clients");
        setIsFetching(false);
      }
      console.log("Client data:", response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsFetching(false);
    }
  }, [searchParams, authToken]);

  useEffect(() => {
    fetchClients();
  }, [searchParams, fetchClients]);

  const handleUpdateOpen = (customer) => {
    const [firstname, ...lastname] = customer.name.split(" ");
    setSelectedCustomer({
      ...customer,
      firstname,
      lastname: lastname.join(" "),
    });
    setUpdateCustomerOpen(true);
  };

  const handleUpdateClose = () => {
    setSelectedCustomer(null);
    setUpdateCustomerOpen(false);
  };

  const handleArchive = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to move this customer to archive?"
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/soft-delete-client/${id}`,
        null, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleArchiveSuccess();
        fetchClients();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      handleError();
    }
  };

  // const fetchClients = async () => {
  //   setIsFetching(true);
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/admin/show-client",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     console.log(response.data.data);
  //     if (response.status === 200) {
  //       const clients = response.data.data.map((client) => ({
  //         id: client.id,
  //         name: client.fullname,
  //         sex: client.gender,
  //         email: client.email,
  //         contact: client.contact_no,
  //         address: client.address,
  //         chosenservices: client.chosen_services,
  //         instructor: client.instructor,
  //         plan: client.plan,
  //         amount: client.amount,
  //         isActive: client.is_active,
  //       }));
  //       setCustomer(clients);
  //       setIsFetching(false);
  //     } else {
  //       console.error("Failed to fetch clients");
  //       setIsFetching(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching clients:", error);
  //     setIsFetching(false);
  //   }
  // };

  // Update customer in the API
  const handleUpdateCustomer = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:8000/api/admin/update-client/${selectedCustomer.id}`,
        {
          firstname: selectedCustomer.firstname,
          lastname: selectedCustomer.lastname,
          email: selectedCustomer.email,
          password: selectedCustomer.password, // Optional: Only if changing password
          address: selectedCustomer.address,
          gender: selectedCustomer.sex,
          contact_no: selectedCustomer.contact,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        // Update local state after successful API update
        const updatedCustomer = {
          ...selectedCustomer,
          fullname:
            selectedCustomer.firstname + " " + selectedCustomer.lastname,
          password: "", // empty password
        };

        setCustomer((prevCustomer) =>
          prevCustomer.map((c) =>
            c.id === selectedCustomer.id ? updatedCustomer : c
          )
        );
        handleUpdateClose();
        setIsLoading(false);
        handleUpdateSuccess();
      } else {
        setIsLoading(false);
        handleError();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setIsLoading(false);
      handleError();
    }
  };

  const handleSubmit = () => {
    navigate("/payment-form", { state: { customer: selectedCustomer } });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
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
            color="success"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleUpdateOpen(params.row)}
          >
            Update
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
      <Header title="Customer" subtitle="Managing the Customer Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
              Add Customer
            </Button>
          </Box>
        </Box>
        <DataGrid
          loading={isFetching}
          checkboxSelection
          rows={customer}
          columns={columns}
        />

        <Dialog
          open={AddCustomerOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <AddCustomer
              closeModal={handleClose}
              onAddCustomer={handleAddCustomer}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={updateCustomerOpen}
          onClose={handleUpdateClose}
          fullWidth
          maxWidth="sm"
        >
          <IconButton
            aria-label="close"
            onClick={handleUpdateClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Box component="form" mt={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  value={selectedCustomer.firstname}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      firstname: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  value={selectedCustomer.lastname}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      lastname: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  value={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      email: e.target.value,
                    })
                  }
                />
                {/* <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  value={selectedCustomer.password}
                  type="password"
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      password: e.target.value,
                    })
                  }
                /> */}
                <TextField
                  fullWidth
                  label="Address"
                  margin="normal"
                  value={selectedCustomer.address}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      address: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Contact No"
                  margin="normal"
                  value={selectedCustomer.contact}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      contact: e.target.value,
                    })
                  }
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateCustomer}
                  disabled={isLoading}
                >
                  Save
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerList;