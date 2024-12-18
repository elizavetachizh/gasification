"use client";
import { alpha, Toolbar, Typography } from "@mui/material";
import React from "react";

interface ToolbarProps {
  length: number;
  content: React.ReactNode;
}

export default function ToolbarComponent({ length, content }: ToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {!!length && `${length} выбрано`}
      </Typography>
      {content}
    </Toolbar>
  );
}
