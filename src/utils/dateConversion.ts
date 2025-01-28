import dayjs from "dayjs";

export const DateConversion = (date: string | undefined) => {
  const formattedTime = dayjs(date).format("HH:mm:ss");
  const formattedDate = dayjs(date).format("DD.MM.YYYY");
  return `${formattedDate} ${formattedTime}`;
};
