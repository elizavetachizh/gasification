"use client";
import React, { useState } from "react";
import {
  useAcceptedOrderMutation,
  useGetOrdersQuery,
} from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function TableDashboard() {
  const [status, setStatus] = useState("created");
  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {
    data: orders,
    isLoading,
    isFetching,
  } = useGetOrdersQuery(
    { status: status, page, page_size },
    { skip: !accessToken },
  );
  const [acceptOrder] = useAcceptedOrderMutation();
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const { handleAction: handleAcceptSelected } = useHandleSelected(
    acceptOrder,
    "Выбранные заявки приняты",
  );

  return (
    <TableWithPagination
      typeTable={"dashboard"}
      orders={orders?.result}
      count={orders?.count}
      isLoading={isLoading}
      isFetching={isFetching}
      selected={selected}
      setSelected={setSelected}
      status={status}
      setStatus={setStatus}
      handleAcceptSelectedAction={handleAcceptSelected}
      date={date}
      setDateAction={setDate}
      setPage={setPage}
      page={page}
      setPageSize={setPageSize}
      page_size={page_size}
    />
  );
}
