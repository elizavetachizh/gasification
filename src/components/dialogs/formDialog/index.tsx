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

interface FormDialogInterface {
  date: null | string;
  setDateAction: (value: string) => void;
  handleConfirmSelectedAction: () => void;
}

export default function FormDialog({
  handleConfirmSelectedAction,
  date,
  setDateAction,
}: FormDialogInterface) {
  const [isDialog, setIsDialog] = useState(false);
  const handleClickOpen = () => {
    setIsDialog(true);
  };

  const handleClose = () => {
    setIsDialog(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>Предложить перенос</Button>
      {isDialog && (
        <Dialog
          open={isDialog}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleConfirmSelectedAction();
              handleClose();
            },
          }}
        >
          <DialogTitle>Модальное окно выбора даты</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Выберете необходимую дату переноса заявки
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
              value={date}
              onChange={(event) => setDateAction(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отменить</Button>
            <Button disabled={!date} type="submit">
              Подтвердить
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}
