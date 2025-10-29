import dayjs, { Dayjs } from "dayjs";

// TODO
enum OTP_TYPE {
  register
}

const generateOTP = (otpLength = 6) => {
  return Math.floor(
    1 * Math.pow(10, otpLength - 1) +
      Math.random() * 9 * Math.pow(10, otpLength - 1)
  ).toString();
};

export const createOTP = async (
  otpType: OTP_TYPE,
  identifier: string,
  options?: {
    otpLength?: number;
    expireAt?: Dayjs;
  }
) => {
  const otp = generateOTP(options?.otpLength);
  const expireAt = options?.expireAt || dayjs().add(5, "minute");

  // await prisma.oTPDetails.deleteMany({
  //   where: { otpType, identifier }
  // });

  // return prisma.oTPDetails.create({
  //   data: {
  //     otpType,
  //     identifier,
  //     otp,
  //     expireAt: expireAt.toDate()
  //   }
  // });
};

export const verifyAndRemoveOTP = async (
  otpType: OTP_TYPE,
  identifier: string,
  otp: string
) => {
  const queryObj = { otpType, identifier, otp };

  // const oTPDetails = await prisma.oTPDetails.findFirst({
  //   where: queryObj
  // });

  // if (!oTPDetails) return false;

  // if (dayjs(oTPDetails.expireAt).diff(dayjs(), "minutes") < 0) {
  //   await prisma.oTPDetails.deleteMany({
  //     where: queryObj
  //   });
  //   return false;
  // }

  // await prisma.oTPDetails.deleteMany({
  //   where: queryObj
  // });

  return true;
};
