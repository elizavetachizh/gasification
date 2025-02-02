import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface DeleteAlertDialogInterface {
  handleDelete: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean | null | number>>;
  open: boolean;
}

export default function BlockUserDialog({
  handleDelete,
  open,
  setOpen,
}: DeleteAlertDialogInterface) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Подтвердить блокировку пользователя?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Отменить</Button>
        <Button color="error" onClick={handleDelete} autoFocus>
          Заблокировать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
