"use client";

import { PRODUCT_ITEMS_ROUTE } from "@/app/_routes/outlet-admin-routes";
import Button from "@/components/shared/molecules/button";
import Card from "@/components/shared/molecules/Card";
import InputFieldWithLabel from "@/components/shared/molecules/inputs/InputFieldWithLabel";
import TextAreaWithLabel from "@/components/shared/molecules/inputs/TextAreaFieldWithLabel";
import PageHeader from "@/components/shared/molecules/PageHeader";
import { useForm } from "react-hook-form";

export default function AddItems() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-7">
      <PageHeader
        headerText="Add product"
        items={[{ label: "Products", href: PRODUCT_ITEMS_ROUTE }]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="flex flex-col gap-4 md:gap-7"
      >
        <Card header="Basic info">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <InputFieldWithLabel
                type="text"
                label="Name"
                name="name"
                control={control}
                placeholder="Enter the product name"
                rules={{ required: "Product name is required" }}
                error={errors.name}
              />
              <InputFieldWithLabel
                type="text"
                label="Short description"
                name="shortDescription"
                control={control}
                placeholder="Enter the short description of the product"
                error={errors.shortDescription}
              />
              <TextAreaWithLabel
                label="Long description"
                name="longDescription"
                control={control}
                placeholder="Enter the long description of the product"
                rows={3}
                error={errors.longDescription}
              />
            </div>
            <div className="flex flex-col gap-4"></div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row-reverse">
            <Button type="submit" colorType="primary">
              Create product
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
