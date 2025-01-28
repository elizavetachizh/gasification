"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/src/lib/features/accounts/accountsApi";
import { setTypeStaff } from "@/src/lib/slices/accountSlice";
import { Box, CircularProgress } from "@mui/material";

interface WithAuthProps {
  children: React.ReactNode;
}

const WithAuthDashboard: React.FC<WithAuthProps> = ({ children }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  const refreshToken = localStorage.getItem("refreshToken");
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (refreshToken) {
      router.replace("/dashboard");
      dispatch(setTypeStaff(userData));
    } else {
      router.replace("/dashboard/login");
    }
  }, [dispatch, refreshToken, router, userData]);

  if (accessToken && (isLoading || !userData)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw", // Ширина всей страницы
          height: "100vh", // Высота всей страницы
          position: "fixed", // Фиксация контейнера
          top: 0,
          left: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Полупрозрачный фон (опционально)
        }}
      >
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  return <>{children}</>;
};

export default WithAuthDashboard;
