"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useGetOrderTypesQuery } from "@/src/lib/features/orders/orderTypesApi";
interface OrderTypeSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}
const OrderTypeSelect: React.FC<OrderTypeSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = useGetOrderTypesQuery();

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    onChange(selectedValue); // Если пустое значение, то передаём `null`
  };

  if (isError)
    return (
      <p style={{ color: "red" }}>
        Ошибка:{" "}
        {("data" in error && error?.data?.toString()) ||
          "Не удалось загрузить виды работ"}
      </p>
    );

  return (
    <FormControl>
      <FormLabel>Выберите вид работ</FormLabel>
      <Select
        error={!value}
        size="small"
        id="construction-object-select"
        value={value || ""}
        disabled={isLoading}
        onChange={handleChange}
        displayEmpty
        label={isLoading ? "Загрузка..." : "Вид работ"}
      >
        <MenuItem disabled={true} value={""}>
          Вид работ
        </MenuItem>
        {data?.map((object) => (
          <MenuItem key={object.id} value={object.id}>
            {object.order_type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OrderTypeSelect;
