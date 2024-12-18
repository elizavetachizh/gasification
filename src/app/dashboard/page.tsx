"use client";
import { Typography, Paper, Button, Toolbar, Box } from "@mui/material";
import TableDashboard from "../../components/table/tableDashboard";
import * as React from "react";
import { useAppDispatch } from "@/src/lib/hooks";
import { resetState } from "@/src/lib/slices/authSlice";
import { accountsApi } from "@/src/lib/features/accounts/accountsApi";
import AppBarWithDrawerComponent from "@/src/components/appBarWithDrawer";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    // Сбрасываем состояние
    dispatch(resetState());
    localStorage.removeItem("refreshToken");
    // Очищаем кэш запросов API
    dispatch(accountsApi.util.resetApiState());
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBarWithDrawerComponent />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
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
            <Button onClick={handleClose}>Выйти</Button>
          </Paper>

          <Typography variant="h5" gutterBottom>
            Список заявок
          </Typography>

          <TableDashboard />
        </Box>
      </Box>
    </>
  );
}
