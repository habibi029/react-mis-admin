import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

export const StatCard = ({ title, value, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export const InventoryItem = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
    <Typography variant="body1">{label}:</Typography>
    <Typography variant="body1" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

export const InventoryExtreme = ({ label, item, icon }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="bold">
        {item.name} ({item.quantity})
      </Typography>
    </Box>
  </Box>
);
