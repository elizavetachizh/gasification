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

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  const refreshToken = localStorage.getItem("refreshToken");
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Получаем текущий URL
  const urlParams = new URLSearchParams(window.location.search);
  // Извлекаем значение параметра 'token'
  const token = urlParams.get("token");
  const resetToken = urlParams.get("reset_token");

  useEffect(() => {
    if (token) {
      router.replace(`/profile/registration/?token=${token}`);
    } else if (resetToken) {
      router.replace(
        `/profile/login/password-reset/password-reset-validate-token/?reset_token=${resetToken}`,
      );
    } else {
      if (refreshToken) {
        router.replace("/profile");
        dispatch(setTypeStaff(userData));
      } else {
        router.replace("/profile/login");
      }
    }
  }, [dispatch, refreshToken, resetToken, router, token, userData]);

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

export default WithAuth;
