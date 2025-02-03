"use client";

import { TableCell } from "@mui/material";
import styled from "styled-components";
import React, { useRef, useState } from "react";

const columnsData = [
  { id: "number", label: "№", width: 60 },
  { id: "date", label: "Дата подачи", width: 130 },
  { id: "name", label: "ФИО заявителя", width: 130 },
  { id: "contact_number", label: "Контактный телефон", width: 150 },
  { id: "work_type", label: "Вид производимых работ", width: 150 },
  { id: "facility_code", label: "Код объекта", width: 150 },
  { id: "work_complex", label: "Комплекс работ", width: 150 },
  { id: "address", label: "Адрес объекта", width: 150 },
  { id: "representative_date", label: "Дата вызова представителя", width: 130 },
];

const ResizableTableCell = styled(TableCell)<{ width: number }>`
  position: relative;
  width: ${(props) => props.width}px;
  min-width: 30px;
  max-width: 600px;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;

  div.resizer {
    position: absolute;
    top: 1rem;
    right: 0;
    width: 2px;
    height: 50%;
    cursor: col-resize;
    background-color:  rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
`;

export default function TableHeadComponent() {
  const [columns, setColumns] = useState(columnsData);

  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleMouseDown = (
    index: number,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    resizingColumn.current = index;
    startX.current = e.clientX;
    startWidth.current = columns[index].width;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingColumn.current === null) return;

    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + deltaX);

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[resizingColumn.current!] = {
        ...newColumns[resizingColumn.current!],
        width: newWidth,
      };
      return newColumns;
    });
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {columns.map((col, index) => (
        <ResizableTableCell key={col.id} width={col.width}>
          {col.label}
          <div
            className="resizer"
            onMouseDown={(e) => handleMouseDown(index, e)}
          />
        </ResizableTableCell>
      ))}
    </>
  );
}
