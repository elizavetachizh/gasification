import { Box, Toolbar, Typography } from "@mui/material";
import React from "react";
import AppBarWithDrawerComponent from "@/src/components/appBarWithDrawer";

export default function DashBoardLayout({
  getLimitsOnDay,
  children,
}: Readonly<{
  getLimitsOnDay: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBarWithDrawerComponent />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            Настройки лимитов на заявки
          </Typography>
          {getLimitsOnDay}
          {children}
        </Box>
      </Box>
    </>
  );
}
