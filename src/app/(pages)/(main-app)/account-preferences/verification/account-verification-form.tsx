"use client";

import Card from "@/components/shared/molecules/card";
import { InputField } from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import { Separator } from "@/components/shared/shadcn-components/separator";
import { H4 } from "@/components/shared/shadcn-components/typography";
import React from "react";
import { accountVerificationSchema } from "../../../../../../validation-schemas";

const formSectionRootCardClassName =
  "max-sm:border-0 max-sm:p-0 max-sm:rounded-none";

const AccountVerificationForm: React.FC = () => {
  return (
    <Form
      render={(register, errors, isSubmitting) => {
        return (
          <div className="flex flex-col gap-4 w-full">
            <Card
              rootClassName={formSectionRootCardClassName}
              title={<H4>NID Verification</H4>}
              description="Please upload clear front and back photos of your NID and enter your NID number"
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    register={register("nidFrontImage")}
                    type="file"
                    label="NID Front Image"
                    name="nidFrontImage"
                    error={errors.nidFrontImage}
                  />
                  <InputField
                    register={register("nidBackImage")}
                    type="file"
                    label="NID Back Image"
                    name="nidBackImage"
                    error={errors.nidBackImage}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <InputField
                    register={register("nidNumber")}
                    type="text"
                    label="NID Number"
                    name="nidNumber"
                    placeholder="e.g. 5110981456895"
                    error={errors.nidNumber}
                  />
                </div>
              </div>
            </Card>

            <Separator className="sm:hidden" />

            <Card
              rootClassName={formSectionRootCardClassName}
              title={<H4>Passport Verification</H4>}
              description="Please upload a clear photo of your passport and enter your
                passport number"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  register={register("passportImage")}
                  type="file"
                  label="Passport Image"
                  name="passportImage"
                  error={errors.passportImage}
                />
                <InputField
                  register={register("passportNumber")}
                  type="text"
                  label="Passport Number"
                  name="passportNumber"
                  placeholder="e.g. AC110058145611"
                  error={errors.passportNumber}
                />
              </div>
            </Card>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      }}
      validationSchema={accountVerificationSchema}
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default AccountVerificationForm;
