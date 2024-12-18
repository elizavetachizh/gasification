import { Avatar, Box, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        {children}
      </Box>
    </Container>
  );
}
