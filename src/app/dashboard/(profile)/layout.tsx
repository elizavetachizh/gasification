"use client";
import ThemeModeContextProvider from "@/src/context/theme";
import { Box, Toolbar, Typography } from "@mui/material";
import AppBarWithDrawerComponent from "@/src/components/appBarWithDrawer";
import * as React from "react";
import { useGetUserQuery } from "@/src/lib/features/accounts/accountsApi";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: userData } = useGetUserQuery();
  return (
    <ThemeModeContextProvider>
      <Box sx={{ display: "flex" }}>
        <AppBarWithDrawerComponent />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          {userData?.is_staff === true ? (
            children
          ) : (
            <Typography
              sx={{ marginTop: "30px" }}
              variant="h4"
              gutterBottom
              align={"center"}
            >
              Недостаточно прав доступа. Обратитесь к администратору.
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeModeContextProvider>
  );
}
