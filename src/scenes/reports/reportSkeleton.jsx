import { Box, Paper, Skeleton, Stack, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const ReportSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const TableSkeleton = () => (
    <Stack spacing={1}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton
            key={item}
            variant="rectangular"
            width={`${100 / 6}%`}
            height={40}
          />
        ))}
      </Box>

      {[1, 2, 3, 4, 5].map((row) => (
        <Box key={row} sx={{ display: "flex", gap: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((cell) => (
            <Skeleton
              key={cell}
              variant="rectangular"
              width={`${100 / 6}%`}
              height={30}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ m: 3, maxWidth: "1400px", pb: "2rem" }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" width={300} height={40} />
        <Skeleton
          variant="rectangular"
          width={200}
          height={20}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Skeleton
          variant="rectangular"
          width={100}
          height={30}
          sx={{ mt: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={30}
          sx={{ mt: 1 }}
        />
      </Box>

      <Paper
        elevation={3}
        sx={{ p: "20px", mb: "20px", backgroundColor: colors.primary[400] }}
      >
        <Skeleton
          variant="rectangular"
          width={200}
          height={30}
          sx={{ mb: 2 }}
        />
        <TableSkeleton />
      </Paper>

      <Paper
        elevation={3}
        sx={{ p: "20px", mb: "20px", backgroundColor: colors.primary[400] }}
      >
        <Skeleton
          variant="rectangular"
          width={200}
          height={30}
          sx={{ mb: 2 }}
        />
        <TableSkeleton />
      </Paper>
    </Box>
  );
};

export default ReportSkeleton;
