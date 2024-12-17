import { configureStore } from "@reduxjs/toolkit";

//API
import { ordersApi } from "@/src/lib/features/orders/ordersApi";
import { accountsTokenApi } from "@/src/lib/features/accounts/accountsTokenApi";
import { constructionObjectsApi } from "@/src/lib/features/constructionObjects/constructionObjectsApi";
import { accountsApi } from "@/src/lib/features/accounts/accountsApi";
import { orderTypesApi } from "@/src/lib/features/orders/orderTypesApi";

//reducers
import { authReducer } from "@/src/lib/slices/authSlice";
import { accountReducer } from "@/src/lib/slices/accountSlice";
import { exceptionDateApi } from "@/src/lib/features/config/exceptionDateApi";
import { clientsApi } from "@/src/lib/features/accounts/accountsClientsApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      account: accountReducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
      [accountsTokenApi.reducerPath]: accountsTokenApi.reducer,
      [constructionObjectsApi.reducerPath]: constructionObjectsApi.reducer,
      [accountsApi.reducerPath]: accountsApi.reducer,
      [orderTypesApi.reducerPath]: orderTypesApi.reducer,
      [exceptionDateApi.reducerPath]: exceptionDateApi.reducer,
      [clientsApi.reducerPath]: clientsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        ordersApi.middleware,
        accountsTokenApi.middleware,
        constructionObjectsApi.middleware,
        accountsApi.middleware,
        orderTypesApi.middleware,
        exceptionDateApi.middleware,
        clientsApi.middleware,
      ]),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
