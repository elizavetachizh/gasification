"use client";
// Контекст для управления темой
import { createContext, useContext, useState } from "react";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material";

export const ThemeModeContext = createContext<{
  toggleTheme: () => void;
  mode: "light" | "dark";
}>({
  toggleTheme: () => {},
  mode: "light",
});

export default function ThemeModeContextProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  // Создаем тему на основе текущего режима
  const theme = createTheme({
    palette: {
      mode,
    },

    typography: {
      h4: {
        color: mode === "dark" ? "#fff" : "#000",
      },
    },
  });

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeModeContext = () => useContext(ThemeModeContext);
