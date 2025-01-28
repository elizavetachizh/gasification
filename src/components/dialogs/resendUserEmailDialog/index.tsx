import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface ResendUserEmailDialogInterface {
  handleResendUserEmail: (id: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ResendUserEmailDialog({
  handleResendUserEmail,
  open,
  setOpen,
}: ResendUserEmailDialogInterface) {
  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Подтвердить повторную отправку письма для подтверждения регистрации
        пользователя?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Отменить</Button>
        <Button color="error" onClick={handleResendUserEmail} autoFocus>
          Отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
