"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import {
  useGetConfigSetupQuery,
  usePutConfigSetupMutation,
} from "@/src/lib/features/config/exceptionDateApi";

export default function GetLimitsOnDayPage() {
  const { data: configSetupInfo, isLoading } = useGetConfigSetupQuery();
  const [putConfigSetup] = usePutConfigSetupMutation();
  const [fridayLimit, setFridayLimit] = useState<number | null>(
    configSetupInfo?.order_count_friday,
  );
  const [dayLimit, setDayLimit] = useState<number | null>(
    configSetupInfo?.order_count_per_day,
  );

  const handlePutConfigSetup = async (
    fridayLimit: number | null,
    dayLimit: number | null,
  ): Promise<void> => {
    await putConfigSetup({
      order_count_per_day: dayLimit,
      order_count_friday: fridayLimit,
    });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="on"
      >
        <FormControl>
          <FormLabel>Лимит заявок на день:</FormLabel>
          <TextField
            size="small"
            type={"number"}
            placeholder="Введите лимит заявок на день"
            value={dayLimit}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDayLimit(Number(event.target.value))
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Лимит заявок на пятницу:</FormLabel>
          <TextField
            size="small"
            type={"number"}
            placeholder="Введите лимит заявок на пятницу"
            value={fridayLimit}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFridayLimit(Number(event.target.value))
            }
          />
        </FormControl>
      </Box>
      <Button
        variant="contained"
        size="small"
        onClick={() => handlePutConfigSetup(fridayLimit, dayLimit)}
      >
        Сохранить
      </Button>
    </>
  );
}
