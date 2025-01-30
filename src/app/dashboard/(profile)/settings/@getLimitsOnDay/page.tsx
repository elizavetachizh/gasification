"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  useGetConfigSetupQuery,
  usePutConfigSetupMutation,
} from "@/src/lib/features/config/exceptionDateApi";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

export default function GetLimitsOnDayPage() {
  const { data: configSetupInfo, isLoading } = useGetConfigSetupQuery();
  const [putConfigSetup, { error, isSuccess }] = usePutConfigSetupMutation();
  const [fridayLimit, setFridayLimit] = useState<number | null | undefined>(0);
  const [dayLimit, setDayLimit] = useState<number | null | undefined>(0);
  const [timeStart, setTimeStart] = useState<string | undefined>("");
  const [timeEnd, setTimeEnd] = useState<string | undefined>("");

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

  useEffect(() => {
    setFridayLimit(configSetupInfo?.order_count_friday);
    setDayLimit(configSetupInfo?.order_count_per_day);
    setTimeStart(configSetupInfo?.time_start);
    setTimeEnd(configSetupInfo?.time_end);
  }, [configSetupInfo]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      {isSuccess && (
        <SuccessAlertComponent
          message={"Данные успешно сохранены."}
          isInitialOpen={isSuccess}
        />
      )}
      {error && (
        <ErrorAlertComponent
          message={"Что-то пошло не так, попробуйте еще раз..."}
          isInitialOpen={!!error}
        />
      )}
      <Paper sx={{ width: "60%", mb: 1, mt: 1, p: 2 }}>
        <Typography variant="subtitle2">Общие настройки лимитов</Typography>
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
      </Paper>
    </>
  );
}
