import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StatBox from "../../components/StatBox";

const DashboardSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" maxWidth={"96rem"}>
      {/* HEADER */}
      <Box display="flex" flexDirection={"column"} mb="30px">
        <Typography variant="h2" fontWeight="bold">
          <Skeleton width={200} />
        </Typography>
        <Typography variant="h5">
          <Skeleton width={300} />
        </Typography>
      </Box>

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
          {[1, 2, 3].map((_, index) => (
            <Box
              key={index}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="33.33%"
            >
              <Skeleton variant="rectangular" width="100%" height="100%">
                <StatBox
                  title={<Skeleton width="50%" />}
                  subtitle={<Skeleton width="30%" />}
                  icon={
                    index === 0 ? (
                      <CalendarMonthOutlinedIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "34px",
                        }}
                      />
                    ) : index === 1 ? (
                      <PointOfSaleIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "34px",
                        }}
                      />
                    ) : (
                      <PersonAddIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "34px",
                        }}
                      />
                    )
                  }
                />
              </Skeleton>
            </Box>
          ))}
        </div>
        {/* Sex Distribution Pie Chart Skeleton */}
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
          maxWidth="50rem"
          padding="2rem"
          paddingBottom="4rem"
        >
          <Box>
            <Typography variant="h5" fontWeight="600">
              <Skeleton width={200} />
            </Typography>
            <Typography variant="h5" fontWeight="600">
              <Skeleton width={150} />
            </Typography>
            <Typography variant="h5" fontWeight="600">
              <Skeleton width={150} />
            </Typography>
          </Box>
          <Skeleton variant="rectangular" width="100%" height="80%" />
        </Box>
      </div>

      {/* ROW 2 */}
      <Box
        marginTop="2rem"
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
        {/* Total Sales Bar Chart Skeleton */}
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
              <Typography variant="h5" fontWeight="600">
                <Skeleton width={200} />
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                <Skeleton width={150} />
              </Typography>
            </Box>
          </Box>
          <Box height="100%" width="100%" padding="1rem" paddingBottom="6rem">
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        </Box>
      </Box>

      {/* ROW 3 */}
      <Box
        marginTop="2rem"
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
        {/* Monthly Sales Skeleton */}
        <Box
          backgroundColor={colors.primary[400]}
          sx={{
            width: {
              xs: "100%",
              md: "100%",
              lg: "60%",
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
              <Typography variant="h5" fontWeight="600">
                <Skeleton width={200} />
              </Typography>
            </Box>
          </Box>
          <Box
            height="100%"
            width="100%"
            paddingInline="1rem"
            paddingBottom="6rem"
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        </Box>

        {/* Daily Sales Skeleton */}
        <Box
          backgroundColor={colors.primary[400]}
          sx={{
            width: {
              xs: "100%",
              md: "100%",
              lg: "60%",
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
              <Typography variant="h5" fontWeight="600">
                <Skeleton width={200} />
              </Typography>
            </Box>
          </Box>
          <Box
            height="100%"
            width="100%"
            paddingInline="1rem"
            paddingBottom="6rem"
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        </Box>
      </Box>
    </Box>
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

export default DashboardSkeleton;
