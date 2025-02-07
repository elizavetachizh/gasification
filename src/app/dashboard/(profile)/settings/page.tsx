"use client";
import dayjs, { Dayjs } from "dayjs";
import Badge from "@mui/material/Badge";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import {
  ConfigStatsDetailsInterface,
  useCreateExceptionDateMutation,
  useGetConfigStatsQuery,
} from "@/src/lib/features/config/exceptionDateApi";
import "dayjs/locale/ru";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

const initialValue = dayjs(new Date());
type DayData = Record<string, number>;

export default function SettingPage() {
  const [createExceptionDate, { isSuccess, error, isLoading }] =
    useCreateExceptionDateMutation();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayValues, setDayValues] = useState<DayData | undefined>({});
  const [inputValue, setInputValue] = useState<number>(0);
  const [monthBoundaries, setMonthBoundaries] = useState<{
    startOfMonth: string;
    endOfMonth: string;
  }>({
    startOfMonth: dayjs().startOf("month").format("YYYY-MM-DD"),
    endOfMonth: dayjs().endOf("month").format("YYYY-MM-DD"),
  });
  const { data: configStatsInfo, isLoading:isLoadingConfigStatsInfo } = useGetConfigStatsQuery({
    start_date: monthBoundaries.startOfMonth,
    end_date: monthBoundaries.endOfMonth,
  });
  // Обработка изменения значения в текстовом поле
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value) || 0;
    setInputValue(newValue);
  };
  console.log(monthBoundaries.startOfMonth);
  console.log(monthBoundaries.endOfMonth);
  useEffect(() => {
    if (!isLoadingConfigStatsInfo) {
      // Преобразуем массив в объект
      const values = configStatsInfo?.result?.reduce(
        (acc: DayData, { date, order_count }: ConfigStatsDetailsInterface) => {
          const formattedDate = dayjs(date).format("YYYY-MM-DD"); // Преобразуем дату в формат YYYY-MM-DD
          acc[formattedDate] = order_count;
          return acc;
        },
        {},
      );
      setDayValues(values);
    }
  }, [isLoadingConfigStatsInfo, configStatsInfo]);

  const renderDay = (
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] },
  ) => {
    const { day, outsideCurrentMonth, ...other } = props;
    // Проверяем, является ли day экземпляром Dayjs
    const dateKey = day.format("YYYY-MM-DD");

    const dayValue = dayValues ? dayValues[dateKey] : undefined;

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={
          !!dayValue ? (
            <Box
              sx={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                backgroundColor: "grey.400",
                color: "white",
                fontSize: "0.65rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {dayValue}
            </Box>
          ) : null
        }
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  // Обработка выбора дня в календаре
  const handleDaySelect = (date: Dayjs | null) => {
    if (date) {
      const dateKey = date.format("YYYY-MM-DD");
      setSelectedDate(dateKey);
      if (dayValues) {
        setInputValue(dayValues[dateKey] || 0);
      }
    }
  };

  const handleCreateExceptionDate = async (
    date: string,
    count: number | null,
  ) => {
    await createExceptionDate({
      on_date: date,
      order_count_per_day: count,
    }).unwrap();
    setSelectedDate("");
  };

  const handleMonthChange = (newMonth: Dayjs) => {
    const startOfMonth = newMonth.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = newMonth.endOf("month").format("YYYY-MM-DD");
    setSelectedDate("");
    setMonthBoundaries({ startOfMonth, endOfMonth });
  };

  return (
    <React.Fragment>
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
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">
          Дополнительные настройки лимитов на конкретную дату
        </Typography>
        <Box
          display="flex"
          gap={2}
          component="form"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <DateCalendar
                sx={{ width: "400px", margin: "0 auto", maxHeight: "300px" }}
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={handleDaySelect}
                disabled={isLoading}
                onMonthChange={handleMonthChange} // Добавлен обработчик изменения месяца
                defaultValue={initialValue}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                  day: renderDay,
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box
            display={"flex"}
            sx={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <FormControl>
              <TextField
                size="small"
                label={"Введите лимит для выбранного дня:"}
                placeholder="Введите лимит для выбранного дня"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                disabled={!selectedDate}
                fullWidth
              />
            </FormControl>
            <Button
              variant="contained"
              size="small"
              disabled={!selectedDate || isLoading}
              onClick={() =>
                handleCreateExceptionDate(selectedDate, inputValue)
              }
            >
              {isLoading ? "Пожалуйста, подождите" : "Сохранить"}
            </Button>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
