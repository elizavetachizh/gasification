"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
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
    configSetupInfo?.[0]?.order_count_friday ?? 0,
  );
  const [dayLimit, setDayLimit] = useState<number | null>(
    configSetupInfo?.[0]?.order_count_per_day ?? 0,
  );
  const [timeStart, setTimeStart] = useState<string>(
    configSetupInfo?.[0]?.time_start ?? "",
  );
  const [timeEnd, setTimeEnd] = useState<string>(
    configSetupInfo?.[0]?.time_end ?? "",
  );
  console.log(configSetupInfo);
  const handlePutConfigSetup = async (
    fridayLimit: number | null,
    dayLimit: number | null,
  ): Promise<void> => {
    await putConfigSetup({
      order_count_per_day: dayLimit,
      order_count_friday: fridayLimit,
      time_start: timeStart,
      time_end: timeEnd,
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
        <div>
          <FormControl>
            <TextField
              size="small"
              type={"number"}
              label={"Лимит заявок на день:"}
              placeholder="Введите лимит заявок на день"
              value={dayLimit}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDayLimit(Number(event.target.value))
              }
            />
          </FormControl>

          <FormControl>
            <TextField
              size="small"
              type={"number"}
              label={"Лимит заявок на пятницу:"}
              placeholder="Введите лимит заявок на пятницу"
              value={fridayLimit}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFridayLimit(Number(event.target.value))
              }
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <TextField
              size="small"
              type={"time"}
              label={"Время начала добавления заявок:"}
              placeholder="Введите время начала добавления заявок"
              value={timeStart}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTimeStart(event.target.value)
              }
            />
          </FormControl>

          <FormControl>
            <TextField
              size="small"
              type={"time"}
              label={"Время окончания добавления заявок:"}
              placeholder="Введите время окончания добавления заявок"
              value={timeEnd}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setTimeEnd(event.target.value)
              }
            />
          </FormControl>
        </div>
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
