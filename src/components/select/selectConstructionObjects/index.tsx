"use client";

import React from "react";
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useGetConstructionObjectsQuery } from "@/src/lib/features/constructionObjects/constructionObjectsApi";
import { ConstructionObjectState } from "@/src/app/profile/page";
interface ConstructionObjectSelectProps {
  value: number | null;
  onChange: (newObject: ConstructionObjectState) => void;
}
const ConstructionObjectSelect: React.FC<ConstructionObjectSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = useGetConstructionObjectsQuery();
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    const selectedElement = data?.find((el) => el.id === selectedValue);
    onChange({
      construction_object: selectedValue,
      address: selectedElement?.address,
      work_packages: selectedElement?.work_packages,
    });
  };
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
        error={!value}
        disabled={isLoading}
        onChange={handleChange}
        displayEmpty
        label={"Код объекта"}
        placeholder={isLoading ? "Загрузка..." : "Код объекта"}
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
