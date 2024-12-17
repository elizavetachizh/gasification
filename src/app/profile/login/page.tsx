"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginAccountMutation } from "@/src/lib/features/accounts/accountsTokenApi";
import { useAppDispatch } from "@/src/lib/hooks";
import { setTokens } from "@/src/lib/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginAccount, { isLoading, error, isSuccess }] =
    useLoginAccountMutation();
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
  console.log(error);
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
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              required
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
                      showPassword
                        ? "hide the password"
                        : "display the password"
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
          {error && error?.status === 401 && (
            <Alert severity="error">Неверный логин либо пароль</Alert>
          )}
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="text"
              onClick={() => router.push(`/profile/login/password-reset`)}
            >
              Забыли пароль?
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
