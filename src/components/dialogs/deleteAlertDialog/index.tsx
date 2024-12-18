import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteAlertDialogInterface {
  handleDelete: () => void;
}

export default function AlertDialog({
  handleDelete,
}: DeleteAlertDialogInterface) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Отменить заявку">
        <IconButton>
          <DeleteIcon onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Подтвердить удаление записи?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button color="error" onClick={handleDelete} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
