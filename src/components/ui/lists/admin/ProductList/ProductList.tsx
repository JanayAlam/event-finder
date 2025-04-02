import Label from "@/components/shared/atoms/typography/Label";
import Paragraph from "@/components/shared/atoms/typography/Paragraph";
import Title from "@/components/shared/atoms/typography/Title";
import ToggleInput from "@/components/shared/molecules/inputs/ToggleInput";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Pagination } from "antd";
import Image from "next/image";
import React from "react";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    basePhoto: "https://placehold.co/75x75",
    isFeatured: true,
    isActive: true,
    isNewArrival: false,
    isBestSeller: false,
    hasMultipleSizes: false,
    basePrice: 100,
    baseStock: 10,
    category: {
      id: 1,
      title: "Category 1"
    },
    brand: {
      id: 1,
      name: "Brand 1"
    }
  },
  {
    id: 2,
    name: "Product 2",
    price: 120.12,
    basePhoto: "https://placehold.co/75x75",
    isFeatured: false,
    isActive: false,
    isNewArrival: true,
    isBestSeller: false,
    hasMultipleSizes: true,
    category: {
      id: 2,
      title: "Category 2"
    },
    brand: {
      id: 2,
      name: "Brand 2"
    },
    sizes: [
      {
        id: 1,
        sizeType: "STANDARD",
        sizeName: "S",
        price: 120.12,
        stock: 10
      },
      {
        id: 2,
        sizeType: "WEIGHT",
        weight: 1.5,
        weightUnit: "KILOGRAM",
        price: 2500,
        stock: 100
      },
      {
        id: 3,
        sizeType: "STANDARD",
        sizeName: "L",
        price: 300,
        stock: 5
      }
    ],
    priceFrom: 120.12,
    sizesCount: 3
  }
];

interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
  if (!products || !products.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="w-full flex flex-col gap-5">
        {products.map((product) => (
          <div
            className="grid grid-cols-[250px,150px,auto,35px] lg:grid-cols-[350px,300px,auto,35px] gap-4 items-center"
            key={product.id}
          >
            <div className="w-[300px]">
              <div className="flex align-center gap-2">
                <Image
                  src={product.basePhoto}
                  alt={product.name}
                  width={75}
                  height={75}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col">
                  <Title level={2}>{product.name}</Title>
                  <Paragraph level={4}>
                    Category: {product.category.title}
                  </Paragraph>
                  <Paragraph level={4}>Brand: {product.brand.name}</Paragraph>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[1fr,1fr] lg:gap-4">
              <div className="flex flex-col gap-2">
                <ToggleInput label="Active" />
                <ToggleInput label="Featured" />
              </div>
              <div className="flex flex-col gap-2">
                <ToggleInput label="Best seller" />
                <ToggleInput label="New arrival" />
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
                    Price: <b>{product.basePrice}</b>
                  </Paragraph>
                  <Paragraph level={4}>
                    Stock: <b>{product.baseStock}</b>
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
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <hr />
        <Pagination total={50} showSizeChanger />
      </div>
    </div>
  );
};

export default ProductList;
