"use client";
import { Typography } from "@mui/material";
import TableDashboard from "../../../components/table/tableDashboard";
import * as React from "react";

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Список заявок
      </Typography>
      <TableDashboard />
    </>
  );
}
