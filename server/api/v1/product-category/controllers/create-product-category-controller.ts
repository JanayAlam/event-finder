import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { uploadFileToS3 } from "../../../../services/amazonS3";
import {
  TProductCategoryCreateParam,
  TProductCategoryCreateRequest
} from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";
import { getBannerPhotoKey, getCoverPhotoKey, getIconKey } from "../utils";

type CreateProductCategoryRequest = Request<
  TProductCategoryCreateParam,
  any,
  TProductCategoryCreateRequest,
  any
>;

export const createProductCategoryHandler = async (
  req: CreateProductCategoryRequest,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;
  const {
    title,
    subtitle,
    parentCategoryId,
    metaTitle,
    metaDescription,
    slug,
    categoryType
  } = req.body;

  try {
    if (!req.user?.outlet) {
      throw new ApiError(401, "Unauthenticated");
    }

    if (req.user.outlet.id !== outletId) {
      throw new ApiError(403, "Forbidden");
    }

    const data: TProductCategoryCreateRequest = {
      title,
      subtitle,
      metaTitle,
      metaDescription,
      slug,
      categoryType
    };

    let bannerPhotoKey: string | undefined;
    let coverPhotoKey: string | undefined;
    let iconKey: string | undefined;

    if (req.files && !Array.isArray(req.files)) {
      const bannerPhoto = req.files["bannerPhoto"]?.[0];
      const coverPhoto = req.files["coverPhoto"]?.[0];
      const icon = req.files["icon"]?.[0];

      if (bannerPhoto) {
        bannerPhotoKey = getBannerPhotoKey(title);

        await uploadFileToS3(
          bannerPhoto,
          { width: 150, height: 150 },
          bannerPhotoKey
        );
      }

      if (coverPhoto) {
        coverPhotoKey = getCoverPhotoKey(title);

        await uploadFileToS3(
          coverPhoto,
          { width: 260, height: 260 },
          coverPhotoKey
        );
      }

      if (icon) {
        iconKey = getIconKey(title);

        await uploadFileToS3(icon, { width: 16, height: 16 }, iconKey);
      }
    }

    if (parentCategoryId) {
      const parentCategory = await prisma.productCategory.findUnique({
        where: { id: parentCategoryId, parentCategory: null }
      });

      if (!parentCategory) {
        throw new ApiError(404, "Parent category not found");
      }

      const productCategory = await prisma.productCategory.create({
        data: {
          ...data,
          bannerPhoto: bannerPhotoKey,
          coverPhoto: coverPhotoKey,
          icon: iconKey,
          outlet: { connect: { id: outletId } },
          parentCategory: {
            connect: { id: parentCategoryId }
          }
        }
      });

      res.status(201).json(productCategory);
      return;
    }

    const productCategory = await prisma.productCategory.create({
      data: {
        ...data,
        bannerPhoto: bannerPhotoKey,
        coverPhoto: coverPhotoKey,
        icon: iconKey,
        outlet: { connect: { id: outletId } }
      }
    });

    res.status(201).json(productCategory);
  } catch (err) {
    next(err);
  }
};
