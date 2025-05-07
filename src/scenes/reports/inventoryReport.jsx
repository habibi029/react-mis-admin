import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Print, GetApp } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logo } from "./logo";
import Header from "../../components/Header";
import ReportSkeleton from "./reportSkeleton";
import { tokens } from "../../theme";

const InventoryReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summaryInventory, setSummaryInventory] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-inventory",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const inventoryData = response.data.data;
      setSummaryInventory(inventoryData);
      setSupplements(
        inventoryData.filter((item) => item.type === "supplement")
      );
      setEquipments(inventoryData.filter((item) => item.type === "equipment"));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = (action) => {
    const doc = new jsPDF();

    // Company logo
    doc.addImage(logo, "PNG", 10, 10, 40, 30);

    // Header
    doc.setFontSize(20);
    doc.text("Sales Report", doc.internal.pageSize.width / 2, 25, {
      align: "center",
    });

    // Summary Inventory table
    doc.setFontSize(14);
    doc.text("Summary Inventory", 14, 50);
    doc.autoTable({
      head: [["No.", "Item Code", "Name", "Description", "Type", "Quantity"]],
      body: summaryInventory.map((item, index) => [
        index + 1,
        item.item_code.toUpperCase(),
        item.name,
        item.short_description || "--",
        item.type,
        item.quantity,
      ]),
      startY: 55,
      columnStyles: {
        3: { cellWidth: 60 },
      },
    });

    // Supplements table
    doc.text("Supplements", 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      head: [
        ["No.", "Item Code", "Name", "Description", "Quantity", "Unit Price"],
      ],
      body: supplements.map((item, index) => [
        index + 1,
        item.item_code.toUpperCase(),
        item.name,
        item.short_description || "--",
        item.quantity,
        item.price,
      ]),
      startY: doc.autoTable.previous.finalY + 15,
      columnStyles: {
        3: { cellWidth: 60 },
      },
    });

    // Equipments table
    doc.text("Equipments", 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      head: [["No.", "Item Code", "Name", "Description", "Quantity"]],
      body: equipments.map((item, index) => [
        index + 1,
        item.item_code.toUpperCase(),
        item.name,
        item.short_description || "--",
        item.quantity,
      ]),
      startY: doc.autoTable.previous.finalY + 15,
      columnStyles: {
        3: { cellWidth: 60 },
      },
    });

    if (action === "download") {
      const confirmDownload = window.confirm(
        "Are you sure you want to download the inventory report?"
      );
      if (confirmDownload) {
        const date = new Date().toISOString().split("T")[0];
        doc.save(`inventory_report_${date}.pdf`);
      }
    } else if (action === "print") {
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  const handlePrint = () => generatePDF("print");
  const handleDownload = () => generatePDF("download");

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [authToken, navigate]);

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <Box m={3} maxWidth={"1400px"} paddingBottom={"2rem"}>
      <Header
        title="Inventory Report"
        subtitle="Print and download inventory reports"
      />
      <Box display="flex" gap={2} mb={2}>
        <Button startIcon={<Print />} variant="contained" onClick={handlePrint}>
          Print
        </Button>
        <Button
          startIcon={<GetApp />}
          variant="contained"
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </Box>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Summary Inventory
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryInventory.map((item, index) => (
                <TableRow key={item.item_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Products
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplements.map((item, index) => (
                <TableRow key={item.item_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper
        elevation={3}
        style={{ padding: "20px", backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h5" gutterBottom>
          Equipments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryReport;
