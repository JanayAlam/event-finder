import dayjs, { Dayjs } from "dayjs";

export const getCurrentDate = (): Dayjs => {
  return dayjs();
};

export const getFormattedCurrentDateTime = (
  formatString = "DD-MM-YYYY HH:mm:ss a"
): string => {
  return getCurrentDate().format(formatString);
};
