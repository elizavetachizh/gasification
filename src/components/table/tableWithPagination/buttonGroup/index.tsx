import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { useState } from "react";

interface SplitButtonProps {
  onAgreeAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  onRejectAction?: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function SplitButton({
  onAgreeAction,
  onRejectAction,
  selected,
  setSelected,
}: SplitButtonProps) {
  const [open, setOpen] = useState<string | boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Grid
        container
        direction="row"
        sx={{
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <ButtonGroup variant="text" aria-label="Basic button group">
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpen("agree")}
          >
            Принять
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => setOpen("reject")}
          >
            Отклонить
          </Button>
        </ButtonGroup>
      </Grid>
      <Dialog
        open={!!open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {open === "agree"
            ? "Принять предлагаемую дату вызова представителя?"
            : "Отклонить предлагаемую дату вызова представителя?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button
            color="error"
            // disabled={isLoadingDelete}
            onClick={() =>
              open === "agree"
                ? onAgreeAction
                  ? onAgreeAction(selected, setSelected)
                  : undefined
                : onRejectAction
                  ? onRejectAction(selected, setSelected)
                  : undefined
            }
            autoFocus
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
