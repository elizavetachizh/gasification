"use client";
import { Alert, IconButton, Snackbar } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export const SuccessAlertComponent = ({
  message,
  isInitialOpen,
}: {
  message: string;
  isInitialOpen: boolean;
}) => {
  const [open, setOpen] = useState(isInitialOpen);
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={() => {
        setOpen(false);
      }}
      message="Операция успешна!"
    >
      <Alert
        severity="success"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
