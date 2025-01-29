import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import ApiError from "../../../../utils/api-error";
import { generateProductPhotoKey } from "../utils";

export const updateProductBasePhotoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;

  if (!req.file) {
    return next(new ApiError(400, "No file uploaded"));
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthenticated");
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { outlet: true }
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const outlet = await prisma.outlet.findUnique({
      where: { outletAdminId: req.user.id }
    });

    if (!outlet || outlet.id !== product.outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const oldBasePhotoKey = product.basePhoto;

    const newBasePhotoKey = generateProductPhotoKey(outlet.id, product.name);

    const uploadResult = await uploadFileToS3(
      req.file,
      { width: 900, height: 900 },
      newBasePhotoKey
    );

    const newProduct = await prisma.product.update({
      where: { id: productId },
      data: { basePhoto: newBasePhotoKey }
    });

    if (oldBasePhotoKey) {
      await removeFilesFromS3(oldBasePhotoKey);
    }

    res.status(200).json({
      basePhoto: newProduct.basePhoto
    });
  } catch (err) {
    next(err);
  }
};
