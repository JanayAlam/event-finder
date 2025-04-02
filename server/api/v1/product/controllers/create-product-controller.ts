import { SIZE_TYPE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import {
  removeFilesFromS3,
  uploadFileToS3
} from "../../../../services/amazonS3";
import {
  TProductCreateParam,
  TProductCreateRequest
} from "../../../../types/product";
import ApiError from "../../../../utils/api-error";
import { generateProductPhotoKey } from "../utils";

export const createProduct = async (
  req: Request<TProductCreateParam, any, TProductCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const { outletId } = req.params;

  const files = req.files as Record<string, any>;

  const basePhoto = files["basePhoto"]?.[0];

  let basePhotoKey: string | undefined;

  const {
    hasMultipleSizes,
    basePrice,
    baseStock,
    baseBarcode,
    baseSKU,
    basePackagingCost,
    frequentlyBoughtProductIds,
    productPriceAndSizes,
    productCategoryId,
    productBrandId,
    ...rest
  } = req.body;

  try {
    if (!req.user || !req.user.outlet || req.user.outlet.id !== outletId) {
      throw new ApiError(401, "Unauthenticated");
    }

    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId, outletId }
    });

    if (!productCategory) {
      throw new ApiError(400, undefined, {
        productCategoryId: "Product category not found"
      });
    }

    if (productBrandId) {
      const productBrand = await prisma.productBrand.findUnique({
        where: { id: productBrandId, outletId }
      });

      if (!productBrand) {
        throw new ApiError(400, undefined, {
          productBrandId: "Product brand not found"
        });
      }
    }

    if (basePhoto) {
      basePhotoKey = generateProductPhotoKey(req.user.outlet.id, rest.name);
      await uploadFileToS3(
        basePhoto,
        { height: 900, width: 900 },
        basePhotoKey
      );
    }

    await prisma.$transaction(async (tx) => {
      let productCreateBody: any = { ...rest };

      if (hasMultipleSizes) {
        productCreateBody = {
          ...productCreateBody,
          hasMultipleSizes,
          productPriceAndSizes: {
            create:
              productPriceAndSizes?.map((ps) => {
                const { sizeName, weight, weightUnit, sizeType, ...rest } = ps;
                if (sizeType === SIZE_TYPE.STANDARD) {
                  return {
                    ...rest,
                    sizeType: SIZE_TYPE.STANDARD,
                    sizeName
                  };
                }
                return {
                  ...rest,
                  sizeType: SIZE_TYPE.WEIGHT,
                  weight,
                  weightUnit
                };
              }) || []
          }
        };
      } else {
        productCreateBody = {
          ...productCreateBody,
          hasMultipleSizes,
          basePrice,
          baseStock,
          baseBarcode,
          baseSKU,
          basePackagingCost
        };
      }

      const product = await tx.product.create({
        data: {
          ...productCreateBody,
          basePhoto: basePhotoKey ?? null,
          productCategory: {
            connect: { id: productCategoryId }
          },
          productBrand: productBrandId
            ? { connect: { id: productBrandId } }
            : undefined,
          outlet: {
            connect: { id: req.user?.outlet?.id }
          }
        }
      });

      if (frequentlyBoughtProductIds && frequentlyBoughtProductIds.length > 0) {
        const validFrequentlyBoughtProductIds = await tx.product.findMany({
          where: {
            id: { in: frequentlyBoughtProductIds }
          },
          select: { id: true }
        });

        const validIds = validFrequentlyBoughtProductIds.map(
          (product) => product.id
        );

        if (validIds.length !== frequentlyBoughtProductIds.length) {
          throw new ApiError(400, undefined, {
            frequentlyBoughtProductIds:
              "Some frequently bought product IDs are invalid"
          });
        }

        await tx.frequentlyBoughtProduct.createMany({
          data: validIds.map((frequentlyBoughtProductId) => ({
            productId: product.id,
            frequentlyBoughtProductId
          })),
          skipDuplicates: true
        });
      }

      res.status(201).json(product);
    });
  } catch (err) {
    if (basePhotoKey) {
      await removeFilesFromS3(basePhotoKey);
    }

    next(err);
  }
};
