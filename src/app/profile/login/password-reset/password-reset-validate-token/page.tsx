"use client";
import {
  usePasswordResetConfirmMutation,
  usePasswordResetValidateTokenMutation,
} from "@/src/lib/features/accounts/accountsApi";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormField } from "@/src/hooks/useFormField";
import { useRouter } from "next/navigation";

export default function PasswordResetValidateTokenPage() {
  // Получаем текущий URL
  const urlParams = new URLSearchParams(window.location.search);
  // Извлекаем значение параметра 'token'
  const token = urlParams.get("reset_token");
  const [passwordResetValidateToken, { error: errorPasswordResetValidateToken }] =
    usePasswordResetValidateTokenMutation();
  const [passwordResetConfirm, { isLoading, error }] =
    usePasswordResetConfirmMutation();
  const router = useRouter();
  console.log(token);
  console.log(window.location.search);

  useEffect(() => {
    passwordResetValidateToken(token);
  }, [passwordResetValidateToken, token]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await passwordResetConfirm({
        password: passwordField.value,
        token,
      }).unwrap();
      passwordField.reset();
      confirmPassword.reset();
      router.push("/login");
    } catch (error) {
      console.error(error);
      passwordField.reset();
      confirmPassword.reset();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handlePasswordResetConfirm}
      noValidate
      sx={{ mt: 1 }}
    >
      <FormControl
        variant="outlined"
        fullWidth
        required
        margin="normal"
        error={passwordField.error}
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Введите новый пароль
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
                  showPassword ? "hide the password" : "display the password"
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
                  showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                }
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        disabled={isLoading || passwordField.value !== confirmPassword.value}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? "Пожалуйста, подождите" : "Подтвердить смену пароля"}
      </Button>
    </Box>
  );
}
2;
