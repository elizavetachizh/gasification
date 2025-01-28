"use client";
import Dialog from "@mui/material/Dialog";
import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useCreateClientMutation } from "@/src/lib/features/accounts/accountsClientsApi";
import { useFormField } from "@/src/hooks/useFormField";
import { useGetCounterpartiesQuery } from "@/src/lib/features/counterparties/CounterpartiesAPI";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import ErrorAlertComponent from "@/src/components/alert/error";

interface FormDialogInterface {
  handleClose: () => void;
  open: boolean;
}

export default function FormCreateUserDialog({
  open,
  handleClose,
}: FormDialogInterface) {
  const { data: counterparties } = useGetCounterpartiesQuery();
  const [counterparty, setCounterparty] = useState<number>(null);
  console.log(counterparties);
  const emailField = useFormField({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Введите корректный email",
  });
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    setCounterparty(selectedValue); // Если пустое значение, то передаём `null`
  };

  const [createClient, { error, isLoading, isSuccess }] =
    useCreateClientMutation();

  if (isSuccess) {
    return (
      <SuccessAlertComponent
        message={
          "Пользователь успешно создан! Пользователю было выслано письмо с паролем на указанный email."
        }
      />
    );
  }
  if (error) {
    return <ErrorAlertComponent message={`Ошибка при создании пользователя`} />;
  }

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
          createClient({
            email,
            counterparty,
          });
          // handleClose();
        },
      }}
    >
      <DialogTitle>Создание нового пользователя</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <FormLabel>
            Выберите контрагента для создания нового пользователя
          </FormLabel>
          <Select
            size="small"
            id="construction-object-select"
            value={counterparty}
            onChange={handleChange}
            placeholder={"Выбор контрагента"}
            displayEmpty
            variant="standard"
            fullWidth
            label={"Контрагент"}
            sx={{ mb: 2 }}
          >
            <MenuItem disabled={true} value={""}>
              Контрагент
            </MenuItem>
            {counterparties?.map((object) => (
              <MenuItem key={object.id} value={object.id}>
                {object.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>
            Введите email, на который пользователю будет выслан пароль
          </FormLabel>
          <TextField
            autoFocus
            required
            sx={{ marginTop: 0 }}
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
        </FormControl>

        <DialogContentText>
          {" "}
          Пользователю будет выслан пароль на указанный email.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отменить</Button>
        <Button type="submit" disabled={emailField.error}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
