"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { useGetConstructionObjectsQuery } from "@/src/lib/features/constructionObjects/constructionObjectsApi";
interface ConstructionObjectSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}
const ConstructionObjectSelect: React.FC<ConstructionObjectSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = useGetConstructionObjectsQuery();
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    onChange(selectedValue); // Если пустое значение, то передаём `null`
  };
  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <p style={{ color: "red" }}>
        Ошибка:
        {("data" in error && error?.data?.toString()) ||
          "Не удалось загрузить объекты"}
      </p>
    );

  return (
    <FormControl>
      <FormLabel>Выберите объект</FormLabel>
      <Select
        size="small"
        id="construction-object-select"
        value={value || ""}
        onChange={handleChange}
        displayEmpty
        label={"Код объекта"}
        placeholder={"Код объекта"}
      >
        <MenuItem disabled={true} value={""}>
          Код объекта
        </MenuItem>
        {data?.map((object) => (
          <MenuItem key={object.id} value={object.id}>
            {object.code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ConstructionObjectSelect;
