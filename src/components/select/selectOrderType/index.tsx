"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { useGetOrderTypesQuery } from "@/src/lib/features/orders/orderTypesApi";
interface OrderTypeSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}
const OrderTypeSelect: React.FC<OrderTypeSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = useGetOrderTypesQuery();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    onChange(selectedValue || null); // Если пустое значение, то передаём `null`
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <p style={{ color: "red" }}>
        Ошибка: {error?.data?.message || "Не удалось загрузить виды работ"}
      </p>
    );

  return (
    <FormControl>
      <FormLabel>Выберите вид работ</FormLabel>
      <Select
        size="small"
        id="construction-object-select"
        value={value || ""}
        onChange={handleChange}
        displayEmpty
        label={"Вид работ"}
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
