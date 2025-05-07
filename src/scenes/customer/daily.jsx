import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useNavigate
import { tokens } from "../../theme";
import { mockDataCustomer } from "../../data/mockData";
import Header from "../../components/Header";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AddCustomer from "./addCustomer";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import DeleteIcon from "@mui/icons-material/Delete";
import transitions from "@material-ui/core/styles/transitions";

const Daily = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleUpdateSuccess = () => {
    showAlert(`Customer successfully updated.`, "success");
  };

  const handleArchiveSuccess = () => {
    showAlert(`Customer successfully archived.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred!", "error");
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
    fetchClientTransactions();
  }, []);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [isFetching, setIsFetching] = useState(false);
  const [customer, setCustomer] = useState([]);

  const handleArchive = async (id) => {
    try {
      const userConfirmed = confirm(
        "Do you want to move this customer transaction to archive?"
      );
      if (!userConfirmed) return;

      const response = await axios.post(
        `http://localhost:8000/api/admin/exercise-transaction/delete/${id}`,
        null, // No payload needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleArchiveSuccess();
        fetchClientTransactions();
      } else {
        handleError();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      handleError();
    }
  };

  const getUniqueInstructors = (transactions) => {
    return transactions
      .reduce((acc, item) => {
        if (item.instructor_name && !acc.includes(item.instructor_name)) {
          acc.push(item.instructor_name);
        }
        return acc;
      }, [])
      .join(", ");
  };

  // const fetchClientTransact = useCallback(async () => {
  //   setIsFetching(true);
  //   try {
  //     const query = searchParams.get("search") || "";
  //     const response = await axios.get(
  //       `http://localhost:8000/api/admin/exercise-transaction/show?search=${query}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       const clients = response.data.data
  //         .filter((client) =>
  //           client.transactions.some((item) => item.tag === "session")
  //         )
  //         .map((client) => ({
  //           id: client.transaction_code,
  //           name: client.client_name,
  //           sex: client.gender,
  //           email: client.email,
  //           contact: client.contact_no,
  //           address: client.address,
  //           chosenservices: client.transactions
  //             .filter((item) => item.tag === "session")
  //             .map((item) => item.exercise_name)
  //             .join(", "),
  //           instructor: getUniqueInstructors(
  //             client.transactions.filter((item) => item.tag === "session")
  //           ),
  //           plan: "session",
  //           totalPrice: client.transactions
  //             .filter((item) => item.tag === "session")
  //             .reduce((total, item) => total + parseFloat(item.price), 0)
  //             .toFixed(2),
  //         }));

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
  // }, [searchParams, authToken]);

  const fetchClientTransactions = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/exercise-transaction/show",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const clients = response.data.data
          .filter((client) =>
            client.transactions.some((item) => item.tag === "session")
          )
          .map((client) => ({
            id: client.transaction_code,
            name: client.client_name,
            sex: client.gender,
            email: client.email,
            contact: client.contact_no,
            address: client.address,
            chosenservices: client.transactions
              .filter((item) => item.tag === "session")
              .map((item) => item.exercise_name)
              .join(", "),
            instructor: getUniqueInstructors(
              client.transactions.filter((item) => item.tag === "session")
            ),
            plan: "session",
            totalPrice: client.transactions
              .filter((item) => item.tag === "session")
              .reduce((total, item) => total + parseFloat(item.price), 0)
              .toFixed(2),
          }));

        setCustomer(clients);
        setIsFetching(false);
      } else {
        console.error("Failed to fetch clients");
        setIsFetching(false);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setIsFetching(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },
    { field: "totalPrice", headerName: "Total Amount", flex: 1 },
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
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleArchive(params.row.id)}
          >
            Remove
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Daily Sales"
        subtitle="Monitor sales from daily-session customers"
      />
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
        <Box display="flex" alignItems="center">
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
        </Box>
        <DataGrid
          loading={isFetching}
          checkboxSelection
          rows={customer}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Daily;