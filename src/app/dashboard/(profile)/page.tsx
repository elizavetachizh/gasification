"use client";
import { Card, Typography } from "@mui/material";
import TableDashboard from "../../../components/table/tableDashboard";
import * as React from "react";

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Список заявок
      </Typography>
      <Card
        variant="outlined"
        sx={{
          maxHeight: "max-content",
          maxWidth: "100%",
          mx: "auto",
          // to make the demo resizable
          overflow: "auto",
          resize: "horizontal",
        }}
      >
        <TableDashboard />
      </Card>
    </>
  );
}
