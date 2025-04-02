"use client";

import Label from "@/components/shared/atoms/typography/Label";
import Paragraph from "@/components/shared/atoms/typography/Paragraph";
import Title from "@/components/shared/atoms/typography/Title";
import ToggleInput from "@/components/shared/molecules/inputs/ToggleInput";
import { getAWSLinkFromKey } from "@/utils/aws";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Image from "next/image";
import React from "react";
import { ProductListItem as IProductListItem } from "../../../../../../server/types/product";

interface ProductListItemProps {
  product: IProductListItem;
  handleToggleChange: (
    field: "isActive" | "isFeatured" | "isBestSeller" | "isNewArrival",
    value: boolean
  ) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  handleToggleChange
}) => {
  return (
    <div className="grid grid-cols-[250px,150px,auto,35px] lg:grid-cols-[350px,300px,auto,35px] gap-4 items-center">
      <div className="w-[300px]">
        <div className="flex align-center gap-2">
          <Image
            src={
              getAWSLinkFromKey(product.basePhoto) ||
              `https://placehold.co/75x75?text=${product.name}`
            }
            alt={product.name}
            width={75}
            height={75}
            style={{ width: "75px", height: "75px", objectFit: "cover" }}
            className="rounded-md"
          />
          <div className="flex flex-col">
            <Title level={2}>{product.name}</Title>
            <Paragraph level={4}>Category: {product.category.title}</Paragraph>
            <Paragraph level={4}>Brand: {product.brand.name}</Paragraph>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[1fr,1fr] lg:gap-4">
        <div className="flex flex-col gap-2">
          <ToggleInput
            label="Active"
            isChecked={product.isActive}
            onChange={(checked) => handleToggleChange("isActive", !checked)}
          />
          <ToggleInput
            label="Featured"
            isChecked={product.isFeatured}
            onChange={(checked) => handleToggleChange("isFeatured", !checked)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <ToggleInput
            label="Best seller"
            isChecked={product.isBestSeller}
            onChange={(checked) => handleToggleChange("isBestSeller", !checked)}
          />
          <ToggleInput
            label="New arrival"
            isChecked={product.isNewArrival}
            onChange={(checked) => handleToggleChange("isNewArrival", !checked)}
          />
        </div>
      </div>

      <div>
        {product.hasMultipleSizes ? (
          <div className="flex flex-col gap-2">
            <Paragraph level={4}>
              Prices from <b>{product.priceFrom}</b>
            </Paragraph>
            <Paragraph level={4}>
              Total sizes: <b>{product.sizesCount}</b>
            </Paragraph>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Paragraph level={4}>
              Price: <b>{product.basePrice || "---"}</b>
            </Paragraph>
            <Paragraph level={4}>
              Stock: <b>{product.baseStock || "---"}</b>
            </Paragraph>
          </div>
        )}
      </div>

      <div className="text-right">
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "1",
                icon: <EditOutlined />,
                label: (
                  <Label level={3} className="cursor-pointer">
                    Edit
                  </Label>
                )
              },
              {
                key: "2",
                icon: <DeleteOutlined />,
                label: (
                  <Label level={3} className="cursor-pointer">
                    Delete
                  </Label>
                )
              }
            ]
          }}
          placement="bottomRight"
        >
          <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default ProductListItem;
