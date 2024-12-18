"use client";
import React, { useState } from "react";
import {
  useAcceptedOrderMutation,
  useGetOrdersQuery,
  useOnConfirmedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";

export default function TableDashboard() {
  const [status, setStatus] = useState("created");
  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrdersQuery(status);
  const [acceptOrder] = useAcceptedOrderMutation();
  const [confirmOrder] = useOnConfirmedOrderMutation();
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const { handleAction: handleAcceptSelected } = useHandleSelected(
    acceptOrder,
    "Выбранные заявки приняты",
  );

  const handleConfirmSelected = async () => {
    try {
      await Promise.all(
        selected.map((id) => confirmOrder({ id, on_date: date }).unwrap()),
      );
      setSelected([]);
    } catch (err) {
      console.error("Ошибка при удалении заявок:", err);
    }
  };

  return (
    <TableWithPagination
      typeTable={"dashboard"}
      orders={orders}
      isLoading={isLoading}
      isFetching={isFetching}
      selected={selected}
      setSelected={setSelected}
      status={status}
      setStatus={setStatus}
      handleAcceptSelectedAction={handleAcceptSelected}
      handleConfirmSelectedAction={handleConfirmSelected}
      date={date}
      setDateAction={setDate}
    />
  );
}
