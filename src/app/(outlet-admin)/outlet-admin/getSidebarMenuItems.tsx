import {
  DASHBOARD_ROUTE,
  PRODUCT_BRANDS_ROUTE,
  PRODUCT_CATEGORIES_ROUTE,
  PRODUCT_ITEMS_ROUTE
} from "@/app/_routes/outlet-admin-routes";
import CircleIcon from "@/assets/icons/CircleIicon";
import { AppstoreOutlined, ProductOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  path?: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  className?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label: path ? <Link href={path}>{label}</Link> : label,
    type,
    className
  } as MenuItem;
}

export const getSidebarMenuItems = (
  selectedKey: string
): MenuProps["items"] => {
  const productsKey =
    selectedKey === "products-items-add"
      ? "products-items-add"
      : selectedKey === "products-items"
        ? "products-items"
        : "products-items";
  const categoriesKey =
    selectedKey === "products-categories-add"
      ? "products-categories-add"
      : selectedKey === "products-categories"
        ? "products-categories"
        : "products-categories";
  const brandsKey =
    selectedKey === "products-brands-add"
      ? "products-brands-add"
      : selectedKey === "products-brands"
        ? "products-brands"
        : "products-brands";

  return [
    getMenuItem(
      "Dashboard",
      "dashboard",
      DASHBOARD_ROUTE,
      <AppstoreOutlined />
    ),
    getMenuItem("Products", "products", undefined, <ProductOutlined />, [
      getMenuItem("Products", productsKey, PRODUCT_ITEMS_ROUTE, <CircleIcon />),
      getMenuItem(
        "Categories",
        categoriesKey,
        PRODUCT_CATEGORIES_ROUTE,
        <CircleIcon />
      ),
      getMenuItem("Brands", brandsKey, PRODUCT_BRANDS_ROUTE, <CircleIcon />)
    ])
  ];
};
