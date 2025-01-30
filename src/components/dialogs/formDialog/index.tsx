"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useOnConfirmedOrderMutation } from "@/src/lib/features/orders/ordersApi";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

interface FormDialogInterface {
  date: null | string;
  setDateAction?: (value: string) => void;
  selected: number[];
  setSelectedAction: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function FormDialog({
  date,
  setDateAction,
  selected,
  setSelectedAction,
}: FormDialogInterface) {
  const [confirmOrder, { isLoading, isSuccess, error }] =
    useOnConfirmedOrderMutation();
  const [isDialog, setIsDialog] = useState(false);
  const handleClickOpen = () => {
    setIsDialog(true);
  };
  const handleClose = () => {
    setIsDialog(false);
  };

  const handleConfirmSelected = async () => {
    try {
      await Promise.all(
        selected.map((id) => confirmOrder({ id, on_date: date }).unwrap()),
      );
      setSelectedAction([]);
    } catch (err) {
      console.error("Ошибка при удалении заявок:", err);
    }
  };

  if (error)
    return (
      <ErrorAlertComponent
        isInitialOpen={!!error}
        message={`Ошибка при создании пользователя`}
      />
    );

  return (
    <React.Fragment>
      {isSuccess && (
        <SuccessAlertComponent
          isInitialOpen={isSuccess}
          message={`Пользователю был отправлен запрос на перенос заявки на ${date} `}
        />
      )}
      <Button onClick={handleClickOpen}>Предложить перенос</Button>
      {isDialog && (
        <Dialog open={isDialog} onClose={handleClose}>
          <DialogTitle>Модальное окно выбора даты</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Выберите необходимую дату для переноса заявки
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="date"
              type="date"
              fullWidth
              variant="standard"
              slotProps={{
                htmlInput: {
                  min: new Date().toISOString().split("T")[0], // Устанавливаем минимальное значение
                },
              }}
              value={date}
              onChange={(event) =>
                setDateAction ? setDateAction(event.target.value) : undefined
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отменить</Button>
            <Button
              disabled={!date || isLoading}
              type="submit"
              onClick={() => handleConfirmSelected()}
            >
              {isLoading ? "Пожалуйста, подождите" : "Подтвердить"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}
