"use client";
import { Tabs, Tab } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  useGetAcceptedOrdersCountQuery,
  useGetCreatedOrdersCountQuery,
  useGetOnConfirmOrdersCountQuery,
} from "@/src/lib/features/orders/ordersApi";

interface TabsInterface {
  status: string;
  setStatus: (status: string) => void;
  onConfirmText?: string;
}

export default function TabsComponent({
  status,
  setStatus,
  onConfirmText = "Заявки на согласовании",
}: TabsInterface) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
  };

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { data: createdOrdersCount } = useGetCreatedOrdersCountQuery(
    undefined,
    { skip: !accessToken },
  );
  const { data: onConfirmOrdersCount } = useGetOnConfirmOrdersCountQuery(
    undefined,
    { skip: !accessToken },
  );
  const { data: acceptedOrdersCount } = useGetAcceptedOrdersCountQuery(
    undefined,
    { skip: !accessToken },
  );

  return (
    <Tabs value={status} onChange={handleChange} centered>
      <Tab value={"created"} label={`Новые заявки (${createdOrdersCount ?? 0})`} />
      <Tab
        value={"on_confirm"}
        label={`${onConfirmText} (${onConfirmOrdersCount ?? 0})`}
      />
      <Tab
        value={"accepted"}
        label={`Принятые заявки (${acceptedOrdersCount ?? 0})`}
      />
    </Tabs>
  );
}
