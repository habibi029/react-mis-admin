import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import HorizontalChart from "../../components/HorizontalChart";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import MonthlySalesBarChart from "../../components/MonthlySalesBarChart";
import StatBox from "../../components/StatBox";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import DashboardSkeleton from "./DashboardSkeleton";
import DailySalesBarChart from "../../components/DailySalesBarChart";
import { useNotification } from "../../context/NotificationContext";

export const getCurrentWeekRange = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(
    today.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    )
  );
  const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);

  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const { initializeNotifications } = useNotification();
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [salesExercise, setSalesExercise] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [maleFemale, setMaleFemale] = useState([]);
  const [weekRange, setWeekRange] = useState("");

  const fetchDashboardData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const dataResponse = response.data;
      setDashboardData(dataResponse);
      console.log(dataResponse);

      const salesExerciseData = dataResponse["Sales_exercise"].map((item) => ({
        service: item.name,
        [item.name]: item.sales,
      }));
      setSalesExercise(salesExerciseData);

      const totalPopulation =
        dataResponse.total_gender[0].female + dataResponse.total_gender[0].male;
      const maleFemaleData = [
        {
          id: "female",
          label: "female",
          value: dataResponse.total_gender[0].female,
          color: "hsl(162, 70%, 50%)",
          percentage:
            (dataResponse.total_gender[0].female / totalPopulation) * 100,
        },
        {
          id: "male",
          label: "male",
          value: dataResponse.total_gender[0].male,
          color: "hsl(344, 70%, 50%)",
          percentage:
            (dataResponse.total_gender[0].male / totalPopulation) * 100,
        },
      ];
      setMaleFemale(maleFemaleData);

      setMonthlySales(dataResponse.monthly_sales);

      setDailySales(dataResponse.daily_sales);

      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchDashboardData();
      initializeNotifications(authToken);
      setWeekRange(getCurrentWeekRange());
    }
  }, [authToken, navigate]);

  return (
    <>
      {isFetching ? (
        <DashboardSkeleton />
      ) : (
        <Box m="20px">
          {/* HEADER */}
          <Header title="Dashboard" subtitle="Welcome to your dashboard" />

          {/* ROW 1 */}
          <div style={styles.row1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                flex: 1,
              }}
            >
              {[
                {
                  title: `${dashboardData.monthly_customer || 0} `,
                  subtitle: "Availment of Monthly",
                  icon: (
                    <CalendarMonthOutlinedIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "40px" }}
                    />
                  ),
                },
                {
                  title: `${dashboardData.session_customer || 0} `,
                  subtitle: "Availment of Daily",
                  icon: (
                    <PointOfSaleIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "40px" }}
                    />
                  ),
                },
                {
                  title: `${
                    dashboardData.session_customer +
                      dashboardData.monthly_customer || 0
                  } `,
                  subtitle: "Guest",
                  icon: (
                    <PersonAddIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "40px" }}
                    />
                  ),
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={"33.33%"}
                >
                  <StatBox
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                  />
                </Box>
              ))}
            </div>
            {/* Female-Male Pie Chart */}
            <Box
              backgroundColor={colors.primary[400]}
              height="500px"
              sx={{
                width: {
                  xs: "100%",
                  md: "100%",
                  lg: "50%",
                },
              }}
              maxWidth={"60rem"}
              padding="2rem"
              paddingBottom={"4rem"}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Sex Distribution
                </Typography>
                <Typography variant="h5" fontWeight="600">
                  Female:{" "}
                  <span style={{ color: colors.greenAccent[500] }}>
                    {maleFemale
                      .find((item) => item.id === "female")
                      ?.percentage.toFixed(2) + "%"}
                  </span>
                </Typography>
                <Typography variant="h5" fontWeight="600">
                  Male:{" "}
                  <span style={{ color: colors.greenAccent[500] }}>
                    {maleFemale
                      .find((item) => item.id === "male")
                      ?.percentage.toFixed(2) + "%"}
                  </span>
                </Typography>
              </Box>
              <PieChart
                height={"100%"}
                isDashboard={true}
                maleFemaleData={maleFemale}
              />
            </Box>
          </div>

          {/* ROW 2 */}
          <Box
            marginTop={"2rem"}
            display="flex"
            gap={2}
            sx={{
              maxWidth: "100rem",
              maxHeight: "500px",
              flexDirection: {
                md: "column",
                lg: "row",
              },
            }}
          >
            {/* Total Sales Bar Chart */}
            <Box
              backgroundColor={colors.primary[400]}
              sx={{
                width: "100%",
              }}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Total Sales Services
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    ₱ {dashboardData.total_sales}
                  </Typography>
                </Box>
              </Box>

              <Box
                height="100%"
                width={"100%"}
                padding={"1rem"}
                paddingBottom={"6rem"}
              >
                <BarChart salesExerciseData={salesExercise} />
              </Box>
            </Box>
          </Box>

          {/* ROW 3 */}
          <Box
            marginTop={"2rem"}
            display="flex"
            gap={2}
            sx={{
              maxWidth: "100rem",
              maxHeight: "500px",
              flexDirection: {
                md: "column",
                lg: "row",
              },
            }}
          >
            {/* Monthly Sales */}
            <Box
              backgroundColor={colors.primary[400]}
              sx={{
                width: {
                  xs: "100%",
                  md: "100%",
                  lg: "50%",
                },
              }}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Monthly Sales
                  </Typography>
                </Box>
              </Box>

              <Box
                height="100%"
                width={"100%"}
                paddingInline={"1rem"}
                paddingBottom={"6rem"}
              >
                <MonthlySalesBarChart monthlySalesData={monthlySales} />
              </Box>
            </Box>

            {/* Daily Sales */}
            <Box
              backgroundColor={colors.primary[400]}
              sx={{
                width: {
                  xs: "100%",
                  md: "100%",
                  lg: "50%",
                },
              }}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Daily Sales (as of {weekRange})
                  </Typography>
                </Box>
              </Box>

              <Box
                height="100%"
                width={"100%"}
                paddingInline={"1rem"}
                paddingBottom={"6rem"}
              >
                <DailySalesBarChart dailySalesData={dailySales} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

const styles = {
  row1: {
    display: "flex",
    gap: "20px",
    width: "100%",
    maxWidth: "100rem",
    flexWrap: "wrap",
  },
};

export default Dashboard;
