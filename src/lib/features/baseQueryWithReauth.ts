import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { backend } from "@/src/const/backend";
import {
  clearTokens,
  setAccessToken,
} from "@/src/lib/slices/authSlice";
import { RootState } from "@/src/lib/store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${backend}`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },

  credentials: "include", // Для отправки HttpOnly cookies (refresh токен)
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, // Аргументы для запроса
  unknown, // Успешный результат
  FetchBaseQueryError // Ошибка
> = async (args, api: BaseQueryApi, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Если токен истек, обновляем его
  if (result.error && result.error.status === 401) {
    // Получение refresh токена из состояния Redux
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshResult = await baseQuery(
      {
        url: "/accounts/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken }, // В теле ничего передавать не нужно, если cookies включены
      },
      api,
      extraOptions,
    );
    console.log(refreshResult);
    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as { access: string }).access;
      api.dispatch(setAccessToken(newAccessToken));
      // Повторяем оригинальный запрос с новым токеном
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshResult.error) {
      api.dispatch(clearTokens());
    } else {
      // Выходим из системы, если обновление токена не удалось
      api.dispatch(clearTokens());
    }
  }

  return result;
};