import dayjs from "dayjs";

export const DateConversion = (date: string | undefined) => {
  return `${dayjs(date).format("DD.MM.YYYY")}`;
};
