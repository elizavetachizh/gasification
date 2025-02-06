import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useBlockClientMutation,
  useUnblockClientMutation,
} from "@/src/lib/features/accounts/accountsClientsApi";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

interface DeleteAlertDialogInterface {
  setOpen: React.Dispatch<React.SetStateAction<null | string>>;
  open: string;
}

export default function BlockUserDialog({
  open,
  setOpen,
}: DeleteAlertDialogInterface) {
  const handleClose = () => {
    setOpen(null);
  };

  const [
    blockClient,
    {
      isLoading: isLoadingBlock,
      isSuccess: isSuccessBlock,
      error: errorBlock,
      isError: isErrorBlock,
    },
  ] = useBlockClientMutation();
  const [
    unblockClient,
    {
      isLoading: isLoadingUnblock,
      isSuccess: isSuccessUnblock,
      error: errorUnblock,
      isError: isErrorUnblock,
    },
  ] = useUnblockClientMutation();

  const handleDelete = async (id: string | number, typeFunction: string) => {
    typeFunction === "block"
      ? await blockClient(+id).unwrap()
      : await unblockClient(+id).unwrap();
    setTimeout(() => setOpen(null), 2000);
  };
  return (
    <React.Fragment>
      {(isSuccessBlock || isSuccessUnblock) && (
        <SuccessAlertComponent
          message={`Пользователь успешно был ${isSuccessBlock ? "заблокирован" : "разблокирован"}.`}
          isInitialOpen={isSuccessBlock || isSuccessUnblock}
        />
      )}
      {(errorBlock || errorUnblock) && (
        <ErrorAlertComponent
          message={`Ошибка при ${isErrorBlock ? "блокировке" : "разблокировке"} пользователя`}
          isInitialOpen={isErrorBlock || isErrorUnblock}
        />
      )}
      <Dialog
        open={!!open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтвердить{" "}
          {open?.split("-")[1] === "block" ? "блокировку " : "разблокировку "}
          пользователя?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button
            color="error"
            onClick={() =>
              handleDelete(open?.split("-")[0], open?.split("-")[1])
            }
            autoFocus
            disabled={isLoadingBlock || isLoadingUnblock}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
