"use client";
import {
  Card,
  Container,
  CardContent,
  FormControl,
  FormLabel,
  CardActions,
  CssBaseline,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { useFormField } from "@/src/hooks/useFormField";
import AppBarProfile from "@/src/components/appBarProfile";
import TableWithPagination from "@/src/components/tableWithPagination";
// import { InfoOutlined } from "@mui/icons-material";

export default function ProfilePage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // Настройка кастомного хука для каждого поля
  const phoneField = useFormField({
    validate: (value) => /^375\d{9}$/.test(value),
    errorMessage: "Формат номера телефона 375XXXXXXXXX",
  });
  const nameField = useFormField({
    validate: (value) => value?.length >= 3,
    errorMessage: "Длина строки не менее 3 символов",
  });
  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Логика авторизации
  //   console.log("Logging in with phone:", phone);
  // };

  return (
    <Box>
      <AppBarProfile />
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
          {/*<Typography level="title-lg" startDecorator={<InfoOutlined />}>*/}
          {/*  Add new card*/}
          {/*</Typography>*/}
          {/*<Divider inset="none" />*/}
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
                helperText={phoneField.helperText}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Вид работ</FormLabel>
              <TextField size="small" type={"text"} placeholder={"Вид работ"} />
            </FormControl>
            <FormControl>
              <FormLabel>Код объекта</FormLabel>
              <TextField
                size="small"
                variant="outlined"
                type={"text"}
                placeholder={"Код объекта"}
              />
            </FormControl>
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
              <TextField size="small" type={"date"} />
            </FormControl>
            <FormControl>
              <FormLabel>Адрес объекта</FormLabel>
              <TextField
                size="small"
                type={"text"}
                placeholder="Адрес объекта"
              />
            </FormControl>
            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Button variant="contained">Оставить заявку</Button>
            </CardActions>
          </CardContent>
        </Card>

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

          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Новые заявки" />
            <Tab label="Предложен перенос заявки" />
            <Tab label="Принятые заявки" />
          </Tabs>
          <TableWithPagination />
        </Card>
      </Container>
    </Box>
  );
}
