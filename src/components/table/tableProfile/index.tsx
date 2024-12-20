"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  useAgreedOrderMutation,
  useCanceledOrderMutation,
  useGetOrdersQuery,
  useRejectedOrderMutation,
} from "@/src/lib/features/orders/ordersApi";
import { useHandleSelected } from "@/src/hooks/useHandleSelected";
import TableWithPagination from "../tableWithPagination";

export default function TableProfile() {
  const [status, setStatus] = useState("created");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrdersQuery(status, { skip: !accessToken });
  const [deleteOrder] = useCanceledOrderMutation();
  const [agreeOrder] = useAgreedOrderMutation();
  const [rejectOrder] = useRejectedOrderMutation();
  const [selected, setSelected] = useState<number[]>([]);

  const { handleAction: handleDeleteSelected } = useHandleSelected(
    deleteOrder,
    "Выбранные заявки удалены",
  );
  const { handleAction: handleAgreeSelected } = useHandleSelected(
    agreeOrder,
    "Выбранные заявки приняты",
  );

  const handleRejectSelected = async () => {
    try {
      await Promise.all(selected.map((id) => rejectOrder(id).unwrap()));
      setSelected([]);
      alert("Выбранные заявки приняты");
    } catch (err) {
      console.error("Ошибка при удалении заявок:", err);
    }
  };
  return (
    <TableWithPagination
      orders={orders}
      isLoading={isLoading}
      isFetching={isFetching}
      selected={selected}
      setSelected={setSelected}
      status={status}
      setStatus={setStatus}
      onConfirmText={"Предложен перенос заявок"}
      handleAgreeSelectedAction={handleAgreeSelected}
      handleDeleteSelectedAction={handleDeleteSelected}
      handleRejectSelectedAction={handleRejectSelected}
    />
  );
}
