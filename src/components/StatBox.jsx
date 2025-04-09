import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" paddingY="24px" paddingX={"36px"}>
      <Box display="flex" alignItems="center" gap={3}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="primary.light"
          borderRadius="50%"
          p={2}
        >
          {icon}
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h2" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: colors.greenAccent[500] }}>
            {subtitle}
          </Typography>
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            {increase}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
