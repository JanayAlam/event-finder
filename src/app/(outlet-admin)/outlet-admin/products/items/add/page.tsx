import { PRODUCT_ITEMS_ROUTE } from "@/app/_routes/outlet-admin-routes";
import PageHeader from "@/components/shared/molecules/PageHeader";

export default function AddItems() {
  return (
    <>
      <PageHeader
        headerText="Add product"
        items={[{ label: "Products", href: PRODUCT_ITEMS_ROUTE }]}
      />
    </>
  );
}
