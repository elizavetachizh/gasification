"use client";
import { useState } from "react";
import AppBarComponent from "@/src/components/appBar";
import DrawerComponent from "@/src/components/drawerComponent";

export default function AppBarWithDrawerComponent({
  is_staff,
}: {
  is_staff?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      {/* AppBar */}
      <AppBarComponent is_staff={is_staff} open={open} setOpen={setOpen} />
      {/* Drawer */}
      {is_staff && <DrawerComponent open={open} setOpen={setOpen} />}
    </>
  );
}
