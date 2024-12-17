"use client";
import { useState } from "react";
import AppBarComponent from "@/src/components/appBar";
import DrawerComponent from "@/src/components/drawerComponent";

export default function AppBarWithDrawerComponent() {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <>
      {/* AppBar */}
      <AppBarComponent open={open} setOpen={setOpen} />
      {/* Drawer */}
      <DrawerComponent open={open} setOpen={setOpen} />
    </>
  );
}
