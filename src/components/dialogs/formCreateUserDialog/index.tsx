"use client";
import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button, TextField } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useCreateClientMutation } from "@/src/lib/features/accounts/accountsClientsApi";
import { useFormField } from "@/src/hooks/useFormField";

interface FormDialogInterface {
  handleClose: () => void;
  open: boolean;
}

export default function FormCreateUserDialog({
  open,
  handleClose,
}: FormDialogInterface) {
  const passwordField = useFormField({
    validate: (value) => /(?=.*[A-Za-z])(?=.*\d).{8,}/.test(value),
    errorMessage:
      "Пароль должен быть больше 8 символов, содержать хотя бы одну букву и одну цифру",
  });
  const emailField = useFormField({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Введите корректный email",
  });

  const [createClient] = useCreateClientMutation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          const password = formJson.password;
          createClient({
            email,
            password,
            counterparty: 2,
          });
          handleClose();
        },
      }}
    >
      <DialogTitle>Создание нового пользователя</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Пользователю будет выслан пароль на указанный email.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          value={emailField.value}
          onChange={emailField.handleChange}
          error={emailField.error}
          helperText={emailField.helperText}
        />
        <TextField
          required
          margin="dense"
          id="password"
          name="password"
          label="Пароль"
          type="password"
          fullWidth
          variant="standard"
          placeholder={"Введите пароль для пользователя"}
          value={passwordField.value}
          onChange={passwordField.handleChange}
          error={passwordField.error}
          helperText={passwordField.helperText}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отменить</Button>
        <Button
          type="submit"
          disabled={passwordField.error || emailField.error}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
