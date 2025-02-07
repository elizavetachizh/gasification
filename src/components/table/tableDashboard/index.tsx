"use client";
import React, { useState } from "react";
import { useAcceptedOrderMutation } from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";
import { SuccessAlertComponent } from "@/src/components/alert/success";
import { ErrorAlertComponent } from "@/src/components/alert/error";

export default function TableDashboard() {
  const [acceptOrder, { isSuccess, error }] = useAcceptedOrderMutation();
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const { handleAction: handleAcceptSelected } = useHandleSelected(acceptOrder);

  return (
    <>
      {isSuccess && (
        <SuccessAlertComponent
          isInitialOpen={isSuccess}
          message={"Выбранные заявки приняты!"}
        />
      )}
      {error && (
        <ErrorAlertComponent
          isInitialOpen={!!error}
          message={"Что-то пошло не так, попробуйте еще раз..."}
        />
      )}
      <TableWithPagination
        typeTable={"dashboard"}
        selected={selected}
        setSelected={setSelected}
        handleAcceptSelectedAction={handleAcceptSelected}
        date={date}
        setDateAction={setDate}
      />
    </>
  );
}
