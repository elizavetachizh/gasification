"use client";
import dayjs, { Dayjs } from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import React, { useState } from "react";
import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";

const initialValue = dayjs("2024-11-17");
type Event = {
  date: string;
  icon?: number;
};
type DayData = Record<string, number>;

export default function SettingPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [dayValues, setDayValues] = useState<DayData>({});
  const [inputValue, setInputValue] = useState<number>(0);

  // Обработка изменения значения в текстовом поле
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value) || 0;
    setInputValue(newValue);

    if (selectedDate) {
      const dateKey = selectedDate.format("YYYY-MM-DD");
      setDayValues((prevValues) => ({ ...prevValues, [dateKey]: newValue }));
    }
  };

  const renderDay = (
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] },
  ) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateKey = day.format("YYYY-MM-DD");
    const dayValue = dayValues[dateKey] || 0;
    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={
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
    setSelectedDate(date);
    if (date) {
      const dateKey = date.format("YYYY-MM-DD");
      setInputValue(dayValues[dateKey] || 0);
    }
  };

  return (
    <>
      <Toolbar />
      <Typography variant="h4" gutterBottom>
        Настройки календаря
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" gap={2}>
          <Box>
            <DateCalendar
              value={selectedDate}
              onChange={handleDaySelect}
              defaultValue={initialValue}
              renderLoading={() => <DayCalendarSkeleton />}
              slots={{
                day: renderDay,
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle1">
              Введите значение для выбранного дня:
            </Typography>
            <TextField
              size="small"
              label="Значение"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              disabled={!selectedDate}
              fullWidth
            />
            <Button variant="contained" size="small">
              Сохранить
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </>
  );
}
