"use client";
import Dialog from "@mui/material/Dialog";
import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import { useCreateClientMutation } from "@/src/lib/features/accounts/accountsClientsApi";
import { useFormField } from "@/src/hooks/useFormField";
import {
  Counterparty,
  useGetCounterpartiesQuery,
} from "@/src/lib/features/counterparties/CounterpartiesAPI";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

interface FormDialogInterface {
  handleClose: () => void;
  open: boolean;
}

export default function FormCreateUserDialog({
  open,
  handleClose,
}: FormDialogInterface) {
  const [inputValue, setInputValue] = useState("");
  const {
    data: counterparties = [],
    isLoading,
    isError,
  } = useGetCounterpartiesQuery();
  const [counterparty, setCounterparty] = useState<number | string>("");

  const emailField = useFormField({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: "Введите корректный email",
  });

  const handleChange = (
    _: React.SyntheticEvent,
    selectedValue: Counterparty,
  ) => {
    setCounterparty(selectedValue.id); // Сохраняем объект или null
  };

  const [createClient, { error, isLoading: isLoadingCreateUser, isSuccess }] =
    useCreateClientMutation();

  return (
    <React.Fragment>
      {isSuccess && (
        <SuccessAlertComponent
          isInitialOpen={isSuccess}
          message={
            "Пользователь успешно создан! Пользователю было выслано письмо с паролем на указанный email."
          }
        />
      )}
      {error && (
        <ErrorAlertComponent
          isInitialOpen={!!error}
          message={`Ошибка при создании пользователя`}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            await createClient({
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

            <Autocomplete
              options={counterparties}
              // value={counterparty}
              inputValue={inputValue}
              getOptionLabel={(option) => option.name}
              loading={isLoading}
              noOptionsText={isError ? "Ошибка загрузки" : "Нет данных"}
              onInputChange={(_, value) => setInputValue(value)}
              onChange={handleChange}
              sx={{ mb: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Выберите контрагента"}
                  variant="standard"
                  fullWidth
                  required
                  error={!!error || !counterparty}
                  size="small"
                  // helperText={error}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>
              Введите email, на который пользователю будет выслан пароль
            </FormLabel>
            <TextField
              required
              id="name"
              name="email"
              size="small"
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
          <Button
            type="submit"
            disabled={emailField.error || isLoadingCreateUser}
          >
            {isLoadingCreateUser ? "Пожалуйста, подождите" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
