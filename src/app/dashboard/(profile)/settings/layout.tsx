import { Paper, Typography } from "@mui/material";
import React from "react";

export default function DashBoardLayout({
  getLimitsOnDay,
  children,
}: Readonly<{
  getLimitsOnDay: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Настройки лимитов на заявки
      </Typography>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {getLimitsOnDay}
        {children}
      </Paper>
    </>
  );
}
