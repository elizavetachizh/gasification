"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import React from "react";
import { usePasswordResetMutation } from "@/src/lib/features/accounts/accountsApi";
import { useFormField } from "@/src/hooks/useFormField";
import { useRouter } from "next/navigation";

export default function PasswordResetPage() {
  const [passwordReset, { isLoading }] = usePasswordResetMutation();
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
    }
  };
  return (
    <Container>
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
        <Typography component="h1" variant="h5">
          Восстановление пароля
        </Typography>
        <Box
          component="form"
          onSubmit={handlePasswordReset}
          noValidate
          sx={{ mt: 1 }}
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
          <Stack spacing={4} direction="row">
            <Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? "Пожалуйста, подождите" : "Отправить"}
              </Button>
            </Box>
            <Box>
              <Button variant="text" onClick={() => router.back()}>
                Отменить
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
