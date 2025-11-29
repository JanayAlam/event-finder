"use client";

import { InputField } from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import { H4 } from "@/components/shared/shadcn-components/typography";
import React from "react";
import { AccountVerificationSchema } from "../../../../../../common/validation-schemas";

interface VerificationSectionProps {
  title: string;
  fields: Array<{
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    error?: any;
    register: any;
  }>;
}

const VerificationSection: React.FC<VerificationSectionProps> = ({
  title,
  fields
}) => (
  <div className="flex flex-col gap-4 w-full">
    <H4>{title}</H4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ name, type, label, placeholder, error, register }) => (
        <InputField
          key={name}
          register={register}
          type={type}
          label={label}
          name={name}
          placeholder={placeholder}
          error={error}
        />
      ))}
    </div>
  </div>
);

const AccountVerificationForm: React.FC = () => {
  return (
    <Form
      render={(register, errors, isSubmitting) => {
        const nidFields = [
          {
            name: "nidFrontImage",
            type: "file",
            label: "NID Front Image",
            error: errors.nidFrontImage,
            register: register("nidFrontImage")
          },
          {
            name: "nidBackImage",
            type: "file",
            label: "NID Back Image",
            error: errors.nidBackImage,
            register: register("nidBackImage")
          },
          {
            name: "nidNumber",
            type: "text",
            label: "NID No.",
            placeholder: "e.g. 5110981456895",
            error: errors.nidNumber,
            register: register("nidNumber")
          }
        ];

        const passportFields = [
          {
            name: "passportImage",
            type: "file",
            label: "Passport Image",
            error: errors.passportImage,
            register: register("passportImage")
          },
          {
            name: "passportNumber",
            type: "text",
            label: "Passport No.",
            placeholder: "e.g. AC110058145611",
            error: errors.passportNumber,
            register: register("passportNumber")
          }
        ];

        return (
          <div className="flex flex-col gap-6 w-full">
            <VerificationSection title="NID Verification" fields={nidFields} />
            <VerificationSection
              title="Passport Verification"
              fields={passportFields}
            />

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
      validationSchema={AccountVerificationSchema}
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default AccountVerificationForm;
