import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const DailySalesBarChart = ({ dailySalesData = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dailySales = dailySalesData
    ?.map((item) => ({
      day: item.day,
      ...Object.fromEntries(
        Object.entries(item.sales || {}).filter(
          ([key]) => key !== "Gym per Month" && key !== "P.I per Month" // Correct filter condition
        )
      ),
    }))
    .filter((item) => Object.keys(item).length > 1); // Remove empty sales data

  return (
    <ResponsiveBar
      data={dailySales}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: colors.primary[400],
          },
        },
      }}
      keys={Array.from(
        new Set(
          dailySalesData.flatMap((item) =>
            Object.keys(item.sales).filter(
              (key) => key !== "Gym per Month" && key !== "P.I per Month" // Ensure these keys are excluded from the chart
            )
          )
        )
      )}
      indexBy="day"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "category10" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "DAY", // X-axis label
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "REVENUE (₱)", // Y-axis label
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={colors.grey[100]}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={(e) =>
        `${e.id}: ₱${e.formattedValue} in service: ${e.indexValue}`
      }
    />
  );
};

export default DailySalesBarChart;
