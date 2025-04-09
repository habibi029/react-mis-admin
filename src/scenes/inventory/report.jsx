import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import {
  InventoryItem,
  StatCard,
  InventoryExtreme,
} from "../../components/ReportComponents";
import {
  Download,
  TrendingUp,
  TrendingDown,
  GetApp,
  Print,
} from "@mui/icons-material";

const Report = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const showAlert = useAlert();
  const [inventoryData, setInventoryData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generatePDF = (action) => {
    const doc = new jsPDF();

    // Company logo
    doc.addImage(logo, "PNG", 10, 10, 40, 40);

    // Header
    doc.setFontSize(20);
    doc.text("Sales Report", doc.internal.pageSize.width / 2, 35, {
      align: "center",
    });

    // Monthly Subscription Sales table
    doc.setFontSize(14);
    doc.text("Monthly Subscription Sales", 14, 60);
    doc.autoTable({
      head: [["No.", "Transaction ID", "Services", "Total Amount"]],
      body: monthlySales.map((sale, index) => [
        index + 1,
        sale.transaction_code,
        sale.transactions.map((item) => item.exercise_name).join(", "),
        sale.total_price,
      ]),
      startY: 65,
    });

    // Daily Subscription Sales table
    doc.text(
      "Daily Subscription Sales",
      14,
      doc.autoTable.previous.finalY + 10
    );
    doc.autoTable({
      head: [["No.", "Transaction ID", "Services", "Total Amount"]],
      body: dailySales.map((sale, index) => [
        index + 1,
        sale.name,
        sale.transactions.map((item) => item.exercise_name).join(", "),
        sale.total_price,
      ]),
      startY: doc.autoTable.previous.finalY + 15,
    });

    // Product Sales table
    doc.text("Product Sales", 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      head: [["No.", "Transaction ID", "Total Amount", "Transaction Date"]],
      body: productSales.map((sale, index) => [
        index + 1,
        sale.transaction_code,
        sale.total_amount,
        sale.created_at,
      ]),
      startY: doc.autoTable.previous.finalY + 15,
    });

    if (action === "download") {
      const confirmDownload = window.confirm(
        "Are you sure you want to download the sales report?"
      );
      if (confirmDownload) {
        const date = new Date().toISOString().split("T")[0];
        doc.save(`sales_report_${date}.pdf`);
      }
    } else if (action === "print") {
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  const handlePrint = () => generatePDF("print");
  const handleDownload = () => generatePDF("download");

  if (isLoading) {
    return <CircularProgress />;
  }

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      const fetchInventoryData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/admin/show-inventory",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setInventoryData(response.data.data);
        } catch (error) {
          console.error("Error fetching inventory data:", error);
          showAlert("Error fetching inventory data", "error");
        }
      };
      fetchInventoryData();
    }
  }, [authToken, navigate, showAlert]);

  const getTotalItems = () => inventoryData.length;
  const getTotalStockLevel = () =>
    inventoryData.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () =>
    inventoryData
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
      .toFixed(2);
  const getTotalItemsByType = (type) =>
    inventoryData.filter((item) => item.type === type).length;
  const getTotalPriceByType = (type) => {
    const total = inventoryData
      .filter((item) => item.type === type)
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      );
    return total.toFixed(2);
  };
  const getMinInventoryItem = () => {
    if (inventoryData.length === 0) return { name: "N/A", quantity: 0 };
    return inventoryData.reduce(
      (minItem, item) => (item.quantity < minItem.quantity ? item : minItem),
      inventoryData[0]
    );
  };
  const getMaxInventoryItem = () => {
    if (inventoryData.length === 0) return { name: "N/A", quantity: 0 };
    return inventoryData.reduce(
      (maxItem, item) => (item.quantity > maxItem.quantity ? item : maxItem),
      inventoryData[0]
    );
  };

  const generateCSV = () => {
    const headers = ["ID", "Item Code", "Name", "Type", "Stock Level", "Price"];
    const rows = inventoryData.map((item) => [
      item.id,
      item.item_code,
      item.name,
      item.type,
      item.quantity,
      item.price,
    ]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    setDialogOpen(false);
    showAlert("CSV report downloaded successfully", "success");
  };

  const handleDownloadClick = () => {
    setDialogOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header
        title="Inventory Report"
        subtitle="Generate reports on inventory data"
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Items"
            value={getTotalItems()}
            color={colors.greenAccent[500]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Stock Level"
            value={getTotalStockLevel()}
            color={colors.blueAccent[500]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Inventory Price"
            value={`₱${getTotalPrice()}`}
            color={colors.redAccent[500]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardHeader title="Item Type Statistics" />
            <CardContent>
              <InventoryItem
                label="Total Equipment Items"
                value={getTotalItemsByType("equipment")}
              />
              <InventoryItem
                label="Total Supplement Items"
                value={getTotalItemsByType("supplement")}
              />
              <InventoryItem
                label="Total Equipment Price"
                value={`₱${getTotalPriceByType("equipment")}`}
              />
              <InventoryItem
                label="Total Supplement Price"
                value={`₱${getTotalPriceByType("supplement")}`}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardHeader title="Inventory Extremes" />
            <CardContent>
              <InventoryExtreme
                label="Minimum Inventory"
                item={getMinInventoryItem()}
                icon={<TrendingDown color="error" />}
              />
              <Divider sx={{ my: 2 }} />
              <InventoryExtreme
                label="Maximum Inventory"
                item={getMaxInventoryItem()}
                icon={<TrendingUp color="success" />}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadClick}
          startIcon={<Download />}
        >
          Download CSV Report
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm CSV Download</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download the inventory report as a CSV
            file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={generateCSV} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Report;
