import * as React from "react";
import WithAuthDashboard from "@/src/utils/withAuthDashboard";
import ThemeModeContextProvider from "@/src/context/theme";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WithAuthDashboard>
      <ThemeModeContextProvider>{children}</ThemeModeContextProvider>
    </WithAuthDashboard>
  );
}
