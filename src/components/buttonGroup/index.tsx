"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Grid } from "@mui/material";

export default function SplitButton() {
  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {" "}
      <ButtonGroup variant="text" aria-label="Basic button group">
        <Button>Принять</Button>
        <Button>Предложить перенос</Button>
      </ButtonGroup>
    </Grid>
  );
}
