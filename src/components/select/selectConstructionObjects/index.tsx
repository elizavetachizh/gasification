"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { useGetConstructionObjectsQuery } from "@/src/lib/features/constructionObjects/constructionObjectsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
interface ConstructionObjectSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}
const ConstructionObjectSelect: React.FC<ConstructionObjectSelectProps> = ({
  value,
  onChange,
}) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  console.log(accessToken);
  const { data, isLoading, isError, error } = useGetConstructionObjectsQuery();
  console.log(data);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    onChange(selectedValue || null); // Если пустое значение, то передаём `null`
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <p style={{ color: "red" }}>
        Ошибка: {error?.data?.message || "Не удалось загрузить объекты"}
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
