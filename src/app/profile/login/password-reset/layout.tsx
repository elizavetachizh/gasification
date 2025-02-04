"use client";
import { Typography } from "@mui/material";
import React from "react";

export default function PasswordResetLayout({
  children,
  passwordResetValidateToken,
}: Readonly<{
  children: React.ReactNode;
  passwordResetValidateToken: React.ReactNode;
}>) {
  // Получаем текущий URL
  const urlParams = new URLSearchParams(window.location.search);
  // Извлекаем значение параметра 'token'
  const token = urlParams.get("reset_token");
  console.log(token);
  return (
    <>
      <Typography component="h1" variant="h5">
        Восстановление пароля
      </Typography>

      {token ? passwordResetValidateToken : children}
    </>
  );
}
