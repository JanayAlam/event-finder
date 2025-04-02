import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../db";
import { TPaginationQuery } from "../../../../types/common/common-types";
import {
  ProductListItem,
  ProductListResponse,
  TProductGetAllParam
} from "../../../../types/product";

export const getAllProductsHandler = async (
  req: Request<TProductGetAllParam, any, any, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const { outletId } = req.params;

    const products = await prisma.product.findMany({
      where: { outletId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        // productCategory: true,
        // productBrand: true,
        // outlet: true,
        // productPriceAndSizes: true,
        // productAdditionalPhotos: true,
        // frequentlyBoughtProducts: true
      }
    });

    const totalProducts = await prisma.product.count();

    res.status(200).json({
      products,
      meta: {
        total: totalProducts,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalProducts / pageSize)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProductListHandler = async (
  req: Request<TProductGetAllParam, any, any, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const { outletId } = req.params;

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: { outletId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          productCategory: true,
          productBrand: true,
          productPriceAndSizes: true
        }
      }),
      prisma.product.count()
    ]);

    const productListResponse: ProductListItem[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      basePhoto: product.basePhoto,
      isFeatured: !!product.isFeatured,
      isActive: !!product.isActive,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
      hasMultipleSizes: !!product.hasMultipleSizes,
      basePrice: Number(product.basePrice) || null,
      baseStock: product.baseStock,
      category: {
        id: product.productCategory?.id,
        title: product.productCategory?.title
      },
      brand: {
        id: product.productBrand?.id || null,
        name: product.productBrand?.name || null
      },
      sizes: product.productPriceAndSizes.map((size) => ({
        id: size.id,
        sizeType: size.sizeType,
        sizeName: size.sizeName,
        price: size.price,
        stock: size.stock,
        weight: size.weight,
        weightUnit: size.weightUnit
      })),
      priceFrom: Math.min(
        ...product.productPriceAndSizes?.map((size) => size.price)
      ),
      sizesCount: product.productPriceAndSizes?.length,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt
    }));

    const responseBody: ProductListResponse = {
      products: productListResponse,
      meta: {
        total: totalProducts,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalProducts / pageSize)
      }
    };

    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

export const getAllDiscountsForProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { outletId, productId } = req.params;

  try {
    const discounts = await prisma.discount.findMany({
      where: {
        outletId,
        discountsOnProducts: {
          some: {
            productId
          }
        }
      }
    });

    res.status(200).json(discounts);
  } catch (err) {
    next(err);
  }
};
