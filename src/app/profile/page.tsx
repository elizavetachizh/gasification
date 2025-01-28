"use client";
import React from "react";
import {
  Card,
  Container,
  CardContent,
  FormControl,
  FormLabel,
  CardActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useFormField } from "@/src/hooks/useFormField";
import { useCreateOrderMutation } from "@/src/lib/features/orders/ordersApi";
import ConstructionObjectSelect from "@/src/components/select/selectConstructionObjects";
import { useState } from "react";
import OrderTypeSelect from "@/src/components/select/selectOrderType";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import AppBarProfile from "@/src/components/appBarProfile";
import { useGetOrdersAvailableQuery } from "@/src/lib/features/config/exceptionDateApi";
import TableProfile from "@/src/components/table/tableProfile";
import { useGetUserQuery } from "@/src/lib/features/accounts/accountsApi";
import { useAppSelector } from "@/src/lib/hooks";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import ErrorAlertComponent from "@/src/components/alert/error";

export interface ConstructionObjectState {
  construction_object: number | null;
  address: string;
  work_packages: number[];
}

function ProfilePage() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { data: ordersAvailable, isLoading } = useGetOrdersAvailableQuery();
  const [createOrder, { isSuccess, error, isLoading: isLoadingCreateOrder }] =
    useCreateOrderMutation();
  const { data: userData } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });

  const [constructionObject, setConstructionObject] =
    useState<ConstructionObjectState>({
      construction_object: null,
      address: "",
      work_packages: [],
    });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [orderType, setOrderType] = useState<number | null>(null);
  // Настройка кастомного хука для каждого поля
  const phoneField = useFormField({
    validate: (value) => /^375\d{9}$/.test(value),
    errorMessage: "Формат номера телефона 375XXXXXXXXX",
  });
  const nameField = useFormField({
    validate: (value) => value?.length >= 3,
    errorMessage: "Длина строки не менее 3 символов",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder({
      applicant: nameField.value,
      selected_date: selectedDate?.format("YYYY-MM-DD"),
      construction_object: constructionObject.construction_object,
      order_type: orderType,
    }).unwrap(); // unwrap для обработки ошибок
    nameField.reset();
    phoneField.reset();
    setConstructionObject({
      construction_object: null,
      address: "",
      work_packages: [],
    });
    setOrderType(null);
    setSelectedDate(null);
  };
  // Функция для блокировки выходных (суббота - 6, воскресенье - 0)
  const isDateAvailable = (date: Dayjs | null) => {
    if (!date) return false;
    return ordersAvailable?.available_dates.includes(date.format("YYYY-MM-DD"));
  };

  return (
    <Box>
      <AppBarProfile />
      <Container maxWidth="lg" component="main">
        {userData?.counterparty ? (
          <React.Fragment>
            <Card
              variant="outlined"
              sx={{
                marginTop: 8,
                maxHeight: "max-content",
                maxWidth: "100%",
                mx: "auto",
                // to make the demo resizable
                overflow: "auto",
                resize: "horizontal",
              }}
            >
              {isSuccess && (
                <SuccessAlertComponent message={"Заявка успешно создана!"} />
              )}

              {error && (
                <ErrorAlertComponent
                  message={` Ошибка при создании заявки: ${error?.data?.selected_date?.toString()}`}
                />
              )}

              <CardContent
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
                  gap: 1.5,
                }}
              >
                {isLoading ? (
                  <CircularProgress size="3rem" />
                ) : ordersAvailable?.status === true ? (
                  <React.Fragment>
                    <FormControl>
                      <FormLabel>ФИО заявителя</FormLabel>
                      <TextField
                        size="small"
                        type={"text"}
                        placeholder="Иванов Иван Иванович"
                        value={nameField.value}
                        onChange={nameField.handleChange}
                        error={nameField.error}
                        helperText={nameField.helperText}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Контактный мобильный телефон</FormLabel>
                      <TextField
                        size="small"
                        type={"text"}
                        placeholder="375444640092"
                        value={phoneField.value}
                        onChange={phoneField.handleChange}
                        error={phoneField.error}
                        required={true}
                        helperText={phoneField.helperText}
                      />
                    </FormControl>
                    <OrderTypeSelect
                      value={orderType}
                      onChange={setOrderType}
                    />
                    <ConstructionObjectSelect
                      value={constructionObject.construction_object}
                      onChange={setConstructionObject}
                    />
                    <FormControl sx={{ gridColumn: "1/-1" }}>
                      <FormLabel>Комплекс работ</FormLabel>
                      {constructionObject.work_packages?.length ? (
                        <TextField
                          size="small"
                          margin="dense"
                          disabled={true}
                          value={constructionObject.work_packages.map(
                            (workPackage) => `${workPackage}`,
                          )}
                          type={"text"}
                          placeholder="Комплекс работ"
                        />
                      ) : (
                        <TextField
                          size="small"
                          disabled={true}
                          type={"text"}
                          placeholder="Данные по коду объекта"
                        />
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Дата</FormLabel>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ru"
                      >
                        <DatePicker
                          value={selectedDate}
                          onChange={(newValue) => setSelectedDate(newValue)}
                          shouldDisableDate={(date) => !isDateAvailable(date)}
                          slots={{
                            textField: TextField, // Используем TextField для кастомизации
                          }}
                          slotProps={{
                            textField: {
                              inputProps: { readOnly: true, required: true }, // Блокировка ручного ввода
                              size: "small",
                              error: !selectedDate,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Адрес объекта</FormLabel>
                      <TextField
                        size="small"
                        type={"text"}
                        value={constructionObject.address}
                        disabled={true}
                        placeholder="Данные по коду объекта"
                      />
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={'Объект УП "МИНГАЗ"'}
                      />
                    </FormControl>
                    <CardActions sx={{ gridColumn: "1/-1" }}>
                      <Button
                        disabled={
                          isLoadingCreateOrder ||
                          nameField.error ||
                          phoneField.error ||
                          !(orderType && constructionObject && selectedDate)
                        }
                        onClick={handleSubmit}
                        variant="contained"
                      >
                        {isLoadingCreateOrder
                          ? "Пожалуйста, подождите"
                          : "Оставить заявку"}
                      </Button>
                    </CardActions>
                  </React.Fragment>
                ) : (
                  <p>Время подачи заявок с 8:00 до 12:00</p>
                )}
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              sx={{
                marginTop: 8,
                marginBottom: 4,
                maxHeight: "max-content",
                maxWidth: "100%",
                mx: "auto",
                // to make the demo resizable
                overflow: "auto",
                resize: "horizontal",
              }}
            >
              <TableProfile />
            </Card>
          </React.Fragment>
        ) : userData?.is_active === false ? (
          <Typography
            sx={{ marginTop: "30px" }}
            variant="h4"
            gutterBottom
            align={"center"}
          >
            Ваша учетная запись заблокирована. Обратитесь к администратору.
          </Typography>
        ) : (
          <Typography
            sx={{ marginTop: "30px" }}
            variant="h4"
            gutterBottom
            align={"center"}
          >
            Недостаточно прав доступа. Обратитесь к администратору.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
export default ProfilePage;
