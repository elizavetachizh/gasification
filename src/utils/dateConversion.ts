import dayjs from "dayjs";

export const DateConversion = (date: string) => {
  return `${dayjs(date).format("DD.MM.YYYY")}`;
};
