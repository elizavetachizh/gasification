"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginAccountMutation } from "@/src/lib/features/accounts/accountsTokenApi";
import { useAppDispatch } from "@/src/lib/hooks";
import { setTokens } from "@/src/lib/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginAccount, { isLoading, error }] = useLoginAccountMutation();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAccount({ password, login }).unwrap();
      dispatch(setTokens(data));
      setLogin("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setLogin("");
      setPassword("");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Авторизация
      </Typography>

      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        {error && "status" in error && error.status === 401 && (
            <Alert severity="error">Неверный логин либо пароль</Alert>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="login"
          label="Логин"
          name="email"
          type={"text"}
          autoComplete="login"
          autoFocus
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <FormControl variant="outlined" fullWidth>
          <InputLabel required htmlFor="outlined-adornment-password">
            Пароль
          </InputLabel>
          <OutlinedInput
            fullWidth
            name="password"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || !login || !password}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? "Пожалуйста, подождите" : "Войти"}
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="text"
            onClick={() => router.push(`/profile/login/password-reset`)}
          >
            Забыли пароль?
          </Button>
        </Box>
      </Box>
    </>
  );
}
