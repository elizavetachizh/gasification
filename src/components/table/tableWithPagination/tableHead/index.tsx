"use client";

import { TableCell } from "@mui/material";
import styled from "styled-components";
import React from "react";

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

const ResizableTableCell = styled(TableCell)`
  white-space: nowrap;
  font-weight: bold;
  div.resizer {
    position: absolute;
    top: 1rem;
    right: 0;
    width: 2px;
    height: 50%;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default function TableHeadComponent() {
  return columnsData.map((col) => (
    <ResizableTableCell key={col.id}>
      {col.label}
      <div className="resizer" />
    </ResizableTableCell>
  ));
}
