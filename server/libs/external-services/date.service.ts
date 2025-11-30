import dayjs, { Dayjs } from "dayjs";

class DateService {
  static currentDate(): Dayjs {
    return dayjs();
  }

  static formattedCurrentDateTime(formatString = "DD-MM-YYYY HH:mm:ss a") {
    return this.currentDate().format(formatString);
  }
}

export default DateService;
