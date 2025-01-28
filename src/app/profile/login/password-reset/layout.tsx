import { Typography } from "@mui/material";
import React from "react";

export default function PasswordResetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Typography component="h1" variant="h5">
        Восстановление пароля
      </Typography>
      {children}
    </>
  );
}
