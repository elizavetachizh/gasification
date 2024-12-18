import { OrderOriginal } from "@/src/lib/features/orders/ordersApi";
import { DateConversion } from "@/src/utils/dateConversion";

export const getOnDateForStatus = (
  statusHistory: OrderOriginal["status_history"],
) => {
  const statusEntry = statusHistory?.find(
    (entry) => entry.status === "on_confirm",
  );
  return DateConversion(statusEntry?.on_date) || null;
};
