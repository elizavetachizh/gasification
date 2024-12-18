"use client";
import { Tabs, Tab } from "@mui/material";
import { showOrdersCount } from "@/src/utils/showOrdersCount";
import React from "react";

interface TabsInterface {
  status: string;
  setStatus: (status: string) => void;
  length: number;
  createdText?: string;
  onConfirmText?: string;
  acceptedText?: string;
}

export default function xTabsComponent({
  status,
  setStatus,
  length,
  createdText = "Новые заявки",
  onConfirmText = "Заявки на согласовании",
  acceptedText = "Принятые заявки",
}: TabsInterface) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatus(newValue);
  };

  return (
    <Tabs value={status} onChange={handleChange} centered>
      <Tab
        value={"created"}
        label={`${createdText} ${showOrdersCount("created", status, length)}`}
      />
      <Tab
        value={"on_confirm"}
        label={`${onConfirmText} ${showOrdersCount("on_confirm", status, length)}`}
      />
      <Tab
        value={"accepted"}
        label={`${acceptedText} ${showOrdersCount("accepted", status, length)}`}
      />
    </Tabs>
  );
}
