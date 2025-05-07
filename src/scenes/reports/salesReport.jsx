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

const SalesReport = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionResponse, productResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/exercise-transaction/show", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        axios.get("http://localhost:8000/api/admin/cart/show", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      const subscriptionData = subscriptionResponse.data.data.map((item) => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString(),
      }));
      setMonthlySales(
        subscriptionData.filter((item) =>
          item.transactions.some((item) => item.tag === "monthly")
        )
      );
      setDailySales(
        subscriptionData.filter((item) =>
          item.transactions.some((item) => item.tag === "session")
        )
      );
      setProductSales(
        productResponse.data.data.map((sale) => ({
          ...sale,
          created_at: new Date(sale.created_at).toLocaleDateString(),
        }))
      );
      console.log(subscriptionResponse.data.data, productResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = (action) => {
    const doc = new jsPDF();

    // Company logo
    doc.addImage(logo, "PNG", 170, 10, 30, 15);

    // Header
    doc.setFontSize(20);
    doc.text("The Gym Republic Cavite City", doc.internal.pageSize.width / 2, 25, {
      align: "center",
    });

    doc.setFontSize(9); // Adjust the font size for the address
    doc.text("5570 Paterno Street, cor, Cajigas St. P. Burgos Ave.", doc.internal.pageSize.width / 2, 30, {
  align: "center",
    });

    doc.setFontSize(18);
    doc.text("Sales Report", doc.internal.pageSize.width / 2, 40, {
      align: "center",
    });
    
    

    // Monthly Subscription Sales table
    doc.setFontSize(14);
    doc.text("Monthly Subscription Sales", 14, 50);
    doc.autoTable({
      head: [["No.", "Transaction ID", "Services", "Total Amount"]],
      body: monthlySales.map((sale, index) => [
        index + 1,
        sale.transaction_code,
        sale.transactions.map((item) => item.exercise_name).join(", "),
        sale.total_price,
      ]),
      startY: 55,
      columnStyles: {
        2: { cellWidth: 60 },
      },
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
        sale.transaction_code,
        sale.transactions.map((item) => item.exercise_name).join(", "),
        sale.total_price,
      ]),
      startY: doc.autoTable.previous.finalY + 15,
      columnStyles: {
        2: { cellWidth: 60 },
      },
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
        title="Sales Report"
        subtitle="Print and download sales reports"
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
          Download
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
          Monthly Subscription Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sale.transaction_code}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sale.transactions
                      .map((item) => item.exercise_name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{sale.total_price}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
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
          Daily Subscription Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailySales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sale.transaction_code}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sale.transactions
                      .map((item) => item.exercise_name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{sale.total_price}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
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
          Product Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productSales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    {sale.transaction_code}
                  </TableCell>
                  <TableCell>{sale.total_amount}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesReport;
