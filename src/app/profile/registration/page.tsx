"use client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  useSignUpConfirmMutation,
  useSignUpValidateTokenMutation,
} from "@/src/lib/features/accounts/accountsApi";
import { useFormField } from "@/src/hooks/useFormField";
import { useRouter } from "next/navigation";

export default function Registration() {
  const router = useRouter();
  const [signUpConfirm, { isLoading, error }] = useSignUpConfirmMutation();
  const [
    signUpValidateToken,
    {
      data: responseData,
      isLoading: isLoadingSignUpValidateToken,
      error: errorSignUpValidateToken,
    },
  ] = useSignUpValidateTokenMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // Извлекаем значение параметра 'token'
  const token = window.location.search.split("=")[1];
  useEffect(() => {
    signUpValidateToken(token);
  }, [signUpValidateToken, token]);

  const passwordField = useFormField({
    validate: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
    errorMessage:
      "Пароль должен содержать не менее 8 символов, включать буквы, цифры и хотя бы один специальный символ",
  });
  const confirmPassword = useFormField({
    validate: (value) => value === passwordField.value,
    errorMessage: "Пароли не совпадают",
  });

  const handleMouseDownPassword = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpConfirm({
      password: passwordField.value,
      token,
    }).unwrap();
    passwordField.reset();
    confirmPassword.reset();
    router.push("/profile/login");
  };

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
        <>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          {responseData && (
            <Typography align={"center"} component="h4">
              Добро пожаловать, {responseData?.name}!
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleRegistration}
            noValidate
            sx={{ mt: 1 }}
          >
            {errorSignUpValidateToken &&
            "status" in errorSignUpValidateToken &&
            errorSignUpValidateToken.status === 400 ? (
              <Alert severity="error">
                Ссылка недействительна. Обратитесь к администратору
              </Alert>
            ) : (
              <>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  error={passwordField.error}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Пароль
                  </InputLabel>
                  <OutlinedInput
                    name="password"
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordField.value}
                    autoComplete="current-password"
                    onChange={passwordField.handleChange}
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
                  <FormHelperText>{passwordField.helperText}</FormHelperText>
                </FormControl>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={confirmPassword.error}
                >
                  <InputLabel htmlFor="outlined-adornment-confirmPassword">
                    Повторите введенный пароль
                  </InputLabel>
                  <OutlinedInput
                    name="confirmPassword"
                    id="outlined-adornment-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword.value}
                    autoComplete="current-password"
                    onChange={confirmPassword.handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? "Скрыть пароль"
                              : "Показать пароль"
                          }
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="repeatPassword"
                  />
                  <FormHelperText>{confirmPassword.helperText}</FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={
                    isLoading || passwordField.value !== confirmPassword.value
                  }
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isLoading ? "Пожалуйста, подождите" : "Зарегистрироваться"}
                </Button>
                {error && (
                  <Alert severity="error">Что-то пошло не так...</Alert>
                )}
              </>
            )}
          </Box>
        </>
      </Box>
    </Container>
  );
}
