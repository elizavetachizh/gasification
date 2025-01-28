"use client";
import * as React from "react";
import WithAuthDashboard from "@/src/utils/withAuthDashboard";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WithAuthDashboard>{children}</WithAuthDashboard>;
}
