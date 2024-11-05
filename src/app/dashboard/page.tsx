"use client";

import { useState } from "react";
import { Toolbar, Typography, Paper, Tabs, Tab } from "@mui/material";
import TableWithPagination from "@/src/components/tableWithPagination";
export default function DashboardPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Toolbar />
      <Typography variant="h4" gutterBottom>
        Персональная информация
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="body1">Подразделение: СЗ</Typography>
        <Typography variant="body1">Табельный номер: 10858</Typography>
        <Typography variant="body1">Email: johndoe@example.com</Typography>
        <Typography variant="body1">
          Контактный телефон: +375444640092
        </Typography>
        <Typography variant="body1">ФИО: Иванов Иван Иванович</Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Список заявок
      </Typography>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      <TableWithPagination />
    </>
  );
}
