export const StatusConversion = (status: string | undefined) => {
  return status === "created"
    ? "Создана"
    : status === "on_confirm"
      ? "Предложен перенос"
      : status === "agreed"
        ? "Одобрен перенос"
        : "Согласована";
};
