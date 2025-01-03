import { OTP_TYPE, USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { verifyAndRemoveOTP } from "../../../../services/otp";
import {
  TAdminLoginRequest,
  TCustomerEmailLoginRequest,
  TCustomerPhoneLoginRequest
} from "../../../../types/auth/auth-types";
import {
  generateAccessAndRefreshToken,
  getUserWithoutPassword
} from "../utils";

export const adminLogin = async (
  req: Request<any, any, TAdminLoginRequest, any>,
  res: Response
) => {
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    res.status(400).json({
      email: "Either email or phone is required",
      phone: "Either email or phone is required"
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: email ? { email } : { phone }
  });

  const invalidCredentialObj: Record<string, string> = {
    email: `${email ? "Email" : "Phone number"} or password did not match`,
    phone: `${email ? "Email" : "Phone number"} or password did not match`,
    password: `${email ? "Email" : "Phone number"} or password did not match`
  };
  if (email) {
    delete invalidCredentialObj.phone;
  } else {
    delete invalidCredentialObj.email;
  }

  if (!user) {
    res.status(400).json(invalidCredentialObj);
    return;
  }

  if (
    user.role !== USER_ROLE.SUPER_ADMIN &&
    user.role !== USER_ROLE.OUTLET_ADMIN
  ) {
    res.status(400).json(invalidCredentialObj);
    return;
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password || "");

  if (!isPasswordMatched) {
    res.status(400).json(invalidCredentialObj);
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken(user);

  res.status(200).json({
    user: getUserWithoutPassword(user),
    accessToken,
    refreshToken
  });
};

export const customerEmailLogin = async (
  req: Request<any, any, TCustomerEmailLoginRequest, any>,
  res: Response
) => {
  const { email, otp } = req.body;

  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    res.status(400).json({
      email: "User not found"
    });
    return;
  }

  const isVerified = await verifyAndRemoveOTP(
    OTP_TYPE.LOGIN_EMAIL_OTP,
    email,
    otp
  );

  if (!isVerified) {
    res.status(400).json({
      email: "OTP did not match or expired",
      otp: "OTP did not match or expired"
    });
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken(user);

  res.status(200).json({
    user: getUserWithoutPassword(user),
    accessToken,
    refreshToken
  });
};

export const customerPhoneLogin = async (
  req: Request<any, any, TCustomerPhoneLoginRequest, any>,
  res: Response
) => {
  const { phone, otp } = req.body;

  let user = await prisma.user.findUnique({
    where: { phone }
  });

  if (!user) {
    res.status(400).json({
      phone: "User not found"
    });
    return;
  }

  const isVerified = await verifyAndRemoveOTP(
    OTP_TYPE.LOGIN_PHONE_OTP,
    phone,
    otp
  );

  if (!isVerified) {
    res.status(400).json({
      phone: "OTP did not match or expired",
      otp: "OTP did not match or expired"
    });
    return;
  }

  const [accessToken, refreshToken] = generateAccessAndRefreshToken(user);

  res.status(200).json({
    user: getUserWithoutPassword(user),
    accessToken,
    refreshToken
  });
};
