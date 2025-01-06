import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../../../db";
import { TSuperAdminCreateRequest } from "../../../../types/auth/auth-types";

export const superAdminRegister = async (
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
