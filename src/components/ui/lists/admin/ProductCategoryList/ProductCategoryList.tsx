import useProductCategorySelectList from "@/hooks/fetch/useProductCategorySelectList";
import { MenuOutlined } from "@ant-design/icons";
import { Table, TableProps } from "antd";
import Link from "next/link";
import React from "react";

interface DataType {
  key: string;
  id: string;
  title: string;
  subtitle: string;
  parentCategory?: {
    id: string;
    title: string;
  };
}

interface ProductCategoryListProps {}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Category title",
    dataIndex: "title",
    key: "title",
    render: (title: string) => <Link href={""}>{title}</Link>
  },
  {
    title: "Parent category",
    dataIndex: "parentCategory",
    key: "parentCategory",
    render: (parentCategory: any) =>
      parentCategory?.title ? (
        <Link href={""}>{parentCategory.title}</Link>
      ) : (
        "---"
      )
  },
  {
    title: "",
    dataIndex: "",
    key: "actions",
    render: () => <MenuOutlined />
  }
];

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    title: "Category 1",
    subtitle: "Subtitle 1",
    parentCategory: {
      id: "1",
      title: "Parent 1"
    }
  },
  {
    key: "2",
    id: "2",
    title: "Category 2",
    subtitle: "Subtitle 2"
  }
];

const ProductCategoryList: React.FC<ProductCategoryListProps> = () => {
  const { productCategorySelectOption } = useProductCategorySelectList();

  console.log(productCategorySelectOption);

  return (
    <Table<DataType>
      bordered
      columns={columns}
      dataSource={data}
      style={{ borderRadius: 6 }}
    />
  );
};

export default ProductCategoryList;
