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

  useEffect(() => {
    if (refreshToken) {
      router.replace("/profile");
      dispatch(setTypeStaff(userData));
    } else {
      router.replace("/profile/login");
    }
  }, [dispatch, refreshToken, router, userData]);

  if (accessToken && (isLoading || !userData)) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress size="3rem" />
      </Box>
    );
  }

  return <>{children}</>;
};

export default WithAuth;
