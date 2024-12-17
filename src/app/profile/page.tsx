"use client";
import {
  Card,
  Container,
  CardContent,
  FormControl,
  FormLabel,
  CardActions,
  TextField,
  Button,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { useFormField } from "@/src/hooks/useFormField";
import TableWithPagination from "@/src/components/tableWithPagination";
import { useCreateOrderMutation } from "@/src/lib/features/orders/ordersApi";
import ConstructionObjectSelect from "@/src/components/select/selectConstructionObjects";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import OrderTypeSelect from "@/src/components/select/selectOrderType";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";

function ProfilePage() {
  const [createOrder, { isSuccess, error, isLoading }] =
    useCreateOrderMutation();
  const [open, setOpen] = useState(true);
  const [constructionObject, setConstructionObject] = useState<string | null>(
    "",
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [orderType, setOrderType] = useState<string | null>("");
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
      construction_object: constructionObject,
      order_type: orderType,
    }).unwrap(); // unwrap для обработки ошибок
    nameField.reset();
    phoneField.reset();
    setConstructionObject("");
    setOrderType("");
    setSelectedDate(null);
  };

  // Функция для блокировки выходных (суббота - 6, воскресенье - 0)
  const disableWeekends = (date: Dayjs | null) => {
    const day = date?.day(); // day() возвращает номер дня недели (0 = воскресенье, 6 = суббота)
    return day === 0 || day === 6;
  };

  // Минимальная и максимальная даты
  const minDate = dayjs().add(3, "day"); // Текущая дата + 3 дня
  const maxDate = dayjs().add(7, "day"); // Текущая дата + 7 дней
  console.log(selectedDate);
  return (
    <Container maxWidth="lg" component="main">
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
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Заявка успешно создана!
            </Alert>
          </Collapse>
        )}
        {error && (
          <Alert severity="error">
            Ошибка при создании заявки: {error?.status}
          </Alert>
        )}
        <CardContent
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
            gap: 1.5,
          }}
        >
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
          <OrderTypeSelect value={orderType} onChange={setOrderType} />
          <ConstructionObjectSelect
            value={constructionObject}
            onChange={setConstructionObject}
          />
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Комплекс работ</FormLabel>
            <TextField
              size="small"
              type={"text"}
              placeholder="Комплекс работ"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Дата</FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <DatePicker
                label="Выберите дату"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                shouldDisableDate={disableWeekends}
                minDate={minDate}
                maxDate={maxDate}
                slots={{
                  textField: TextField, // Используем TextField для кастомизации
                }}
                slotProps={{
                  textField: {
                    inputProps: { readOnly: true, required: true }, // Блокировка ручного ввода
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <FormLabel>Адрес объекта</FormLabel>
            <TextField size="small" type={"text"} placeholder="Адрес объекта" />
          </FormControl>
          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button
              disabled={isLoading || nameField.error}
              onClick={handleSubmit}
              variant="contained"
            >
              {isLoading ? "Пожалуйста, подождите" : "Оставить заявку"}
            </Button>
          </CardActions>
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
        <TableWithPagination />
      </Card>
    </Container>
  );
}
export default ProfilePage;
