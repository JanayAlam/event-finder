import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import {
  TProductCategoryUpdateParam,
  TProductCategoryUpdateRequest
} from "../../../../types/product-category";
import ApiError from "../../../../utils/api-error";
import { getBannerPhotoKey, getCoverPhotoKey, getIconKey } from "../utils";

export const updateProductCategoryHandler = async (
  req: Request<
    TProductCategoryUpdateParam,
    any,
    TProductCategoryUpdateRequest,
    any
  >,
  res: Response,
  next: NextFunction
) => {
  const { productCategoryId } = req.params;
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
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId }
    });

    if (!existingProductCategory) {
      throw new ApiError(404, "Product category not found");
    }

    const data: TProductCategoryUpdateRequest = {
      title,
      subtitle,
      metaTitle,
      metaDescription,
      slug,
      categoryType
    };

    if (parentCategoryId) {
      if (parentCategoryId === existingProductCategory.id) {
        throw new ApiError(400, undefined, {
          parentCategoryId:
            "Parent category cannot be the same as the category itself"
        });
      }

      const parentProductCategory = await prisma.productCategory.findUnique({
        where: { id: parentCategoryId, parentCategory: null }
      });

      if (!parentProductCategory) {
        throw new ApiError(400, undefined, {
          parentCategoryId: "Parent product category not found"
        });
      }

      data.parentCategoryId = parentProductCategory.id;
    }

    let bannerPhotoKey: string | undefined;
    let coverPhotoKey: string | undefined;
    let iconKey: string | undefined;

    if (req.files && !Array.isArray(req.files)) {
      const bannerPhoto = req.files["bannerPhoto"]?.[0];
      const coverPhoto = req.files["coverPhoto"]?.[0];
      const icon = req.files["icon"]?.[0];

      if (bannerPhoto) {
        if (existingProductCategory.bannerPhoto) {
          await removeFilesFromS3(existingProductCategory.bannerPhoto);
        }

        bannerPhotoKey = getBannerPhotoKey(
          title || existingProductCategory.title
        );

        await uploadFileToS3(
          bannerPhoto,
          { width: 150, height: 150 },
          bannerPhotoKey
        );
      }

      if (coverPhoto) {
        if (existingProductCategory.coverPhoto) {
          await removeFilesFromS3(existingProductCategory.coverPhoto);
        }

        coverPhotoKey = getCoverPhotoKey(
          title || existingProductCategory.title
        );

        await uploadFileToS3(
          coverPhoto,
          { width: 260, height: 260 },
          coverPhotoKey
        );
      }

      if (icon) {
        if (existingProductCategory.icon) {
          await removeFilesFromS3(existingProductCategory.icon);
        }

        iconKey = getIconKey(title || existingProductCategory.title);

        await uploadFileToS3(icon, { width: 16, height: 16 }, iconKey);
      }
    }

    const productCategory = await prisma.productCategory.update({
      where: { id: existingProductCategory.id },
      data: {
        ...data,
        bannerPhoto: bannerPhotoKey || existingProductCategory.bannerPhoto,
        coverPhoto: coverPhotoKey || existingProductCategory.coverPhoto,
        icon: iconKey || existingProductCategory.icon
      },
      include: {
        childCategories: true
      }
    });

    res.status(200).json(productCategory);
  } catch (err) {
    next(err);
  }
};
