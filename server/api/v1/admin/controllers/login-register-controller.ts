import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { serializeUserResponse } from "../../../../serializers/user";
import {
  generateAccessAndRefreshToken,
  saveRefreshToken
} from "../../../../services/token";
import { REFRESH_TOKEN_EXPIRATION_TIME_SECOND } from "../../../../settings/config";
import { COOKIE_KEYS, cookieOptions } from "../../../../settings/cookies";
import {
  TAdminLoginRequest,
  TSuperAdminCreateRequest
} from "../../../../types/admin";

export const superAdminRegisterHandler = async (
  req: Request<any, any, TSuperAdminCreateRequest, any>,
  res: Response
) => {
  const { email, phone, password } = req.body;

  if (email) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (user) {
      res.status(400).json({
        email: "Email already exist"
      });
      return;
    }
  }

  if (phone) {
    const user = await prisma.user.findUnique({
      where: {
        phone
      }
    });

    if (user) {
      res.status(400).json({
        phone: "Phone number already exist"
      });
      return;
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      email,
      phone,
      password: hashedPassword,
      role: USER_ROLE.SUPER_ADMIN
    }
  });

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(200).json(userWithoutPassword);
};

export const adminLoginHandler = async (
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

  if (user.isUserBlocked) {
    res.status(403).json({
      message: "User is blocked"
    });
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

  const serializedUser = serializeUserResponse(user);

  await saveRefreshToken(refreshToken, user.id);

  res
    .status(200)
    .cookie(COOKIE_KEYS.authAccessToken, `Bearer ${accessToken}`, cookieOptions)
    .cookie(COOKIE_KEYS.authRefreshToken, `Bearer ${refreshToken}`, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME_SECOND * 1000
    })
    .cookie(COOKIE_KEYS.authUser, serializedUser, cookieOptions)
    .json({
      user: serializedUser,
      accessToken,
      refreshToken
    });
};
