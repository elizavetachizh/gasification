import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Grid } from "@mui/material";

interface SplitButtonProps {
  onAgreeAction: (
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
  ) => Promise<void>;
  onRejectAction: (
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
  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <ButtonGroup variant="text" aria-label="Basic button group">
        <Button variant="contained" color="success" onClick={() => onAgreeAction(selected, setSelected)}>
          Принять
        </Button>
        <Button variant="text" color="error" onClick={() => onRejectAction(selected, setSelected)}>
          Отклонить
        </Button>
      </ButtonGroup>
    </Grid>
  );
}
