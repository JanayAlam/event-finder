import { SIZE_TYPE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TProductCreateRequest } from "../../../../types/product";
import ApiError from "../../../../utils/api-error";

export const createProduct = async (
  req: Request<any, any, TProductCreateRequest, any>,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Record<string, any>;
  const basePhoto = files["basePhoto"]?.[0];
  const additionalPhotos = files["additionalPhotos"];

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
    if (!req.user) {
      throw new ApiError(401, "Unauthenticated");
    }

    const outlet = await prisma.outlet.findFirst({
      where: {
        outletAdminId: req.user.id
      }
    });

    if (!outlet) {
      throw new ApiError(404, "Outlet not found");
    }

    const productCategory = await prisma.productCategory.findUnique({
      where: { id: productCategoryId }
    });

    if (!productCategory) {
      throw new ApiError(400, undefined, {
        productCategoryId: "Product category not found"
      });
    }

    if (productBrandId) {
      const productBrand = await prisma.productBrand.findUnique({
        where: { id: productBrandId }
      });

      if (!productBrand) {
        throw new ApiError(400, undefined, {
          productBrandId: "Product brand not found"
        });
      }
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
          productCategory: {
            connect: { id: productCategoryId }
          },
          productBrand: productBrandId
            ? { connect: { id: productBrandId } }
            : undefined,
          outlet: {
            connect: { id: outlet.id }
          }
        },
        include: {
          productAdditionalPhotos: true,
          frequentlyBoughtProducts: true,
          productCategory: true,
          productBrand: true,
          productPriceAndSizes: true
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
          }))
        });
      }

      res.status(201).json(product);
    });
  } catch (err) {
    next(err);
  }
};
