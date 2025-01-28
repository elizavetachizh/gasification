"use client";
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { usePasswordResetMutation } from "@/src/lib/features/accounts/accountsApi";
import { useFormField } from "@/src/hooks/useFormField";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

export default function PasswordResetPage() {
  const [passwordReset, { isLoading, error, isSuccess }] =
    usePasswordResetMutation();
  const email = useFormField({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Введите корректный email",
  });
  const router = useRouter();
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await passwordReset({ email: email.value }).unwrap();
      email.reset();
    } catch (error) {
      console.error(error);
      email.reset();
    }
  };
  const [open, setOpen] = useState(true);
  return (
    <>
      {isSuccess && (
        <Collapse in={open}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 1, mt: 1 }}
          >
            На указанную электронную почту была отправлена ссылка для сброса
            пароля
          </Alert>
        </Collapse>
      )}
      <Box
        component="form"
        onSubmit={handlePasswordReset}
        noValidate
        sx={{ mt: 1, width: "100%" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="email"
          name="email"
          type={"text"}
          autoComplete="email"
          autoFocus
          value={email.value}
          error={email.error}
          onChange={email.handleChange}
          helperText={email.helperText}
        />

        {error && "status" in error && error?.status === 400 && (
          <Alert severity="error">
            Не было найдено учетной записи, связанной с указанным адресом
            электронной почты. Попробуйте использовать другой адрес электронной
            почты.
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            mb: 1,
          }}
        >
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading || !email.value}
          >
            {isLoading ? "Пожалуйста, подождите" : "Отправить"}
          </Button>
          <Button fullWidth variant="text" onClick={() => router.back()}>
            Отменить
          </Button>
        </Box>
      </Box>
    </>
  );
}
