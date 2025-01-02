import { USER_ROLE } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../../db";
import { createUser } from "../../../services/user-service";
import {
  TOutletAdminCreateRequest,
  TSuperAdminCreateRequest
} from "../../../types/auth";

export const superAdminRegister = async (req: Request, res: Response) => {
  const { email, phone, password }: TSuperAdminCreateRequest = req.body;

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
        email: "Phone number already exist"
      });
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await createUser({
    email,
    phone,
    password: hashedPassword,
    role: USER_ROLE.SUPER_ADMIN
  });

  res.status(200).json(newUser);
};

export const outletAdminRegister = async (req: Request, res: Response) => {
  const { email, phone, password }: TOutletAdminCreateRequest = req.body;

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
        email: "Phone number already exist"
      });
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await await createUser({
    email,
    phone,
    password: hashedPassword,
    role: USER_ROLE.OUTLET_ADMIN
  });

  res.status(200).json(newUser);
};

export const userLogin = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello"
  });
};
