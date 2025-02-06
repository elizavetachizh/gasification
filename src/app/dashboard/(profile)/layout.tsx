"use client";
import { useThemeModeContext } from "@/src/context/theme";
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
  const { mode } = useThemeModeContext();
  return (
      <Box sx={{ display: "flex" }}>
        <AppBarWithDrawerComponent />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: `${mode === "dark" ? "#121212 !important" : "hsla(215, 15%, 97%, 0.5)"}`,
            p: 3,
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          {userData && userData?.is_staff === true ? (
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
  );
}
