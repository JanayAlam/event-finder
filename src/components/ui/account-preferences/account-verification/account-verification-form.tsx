"use client";

import { InputField } from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import { H4 } from "@/components/shared/shadcn-components/typography";
import AccountVerificationRepository from "@/repositories/account-verification.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import { toast } from "sonner";
import {
  AccountVerificationSchema,
  TAccountVerificationRequestDto
} from "../../../../../common/validation-schemas";

interface VerificationSectionProps {
  title: string;
  fields: Array<{
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    error?: any;
    control: any;
  }>;
}

const VerificationSection: React.FC<VerificationSectionProps> = ({
  title,
  fields
}) => (
  <div className="flex flex-col gap-4 w-full">
    <H4>{title}</H4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ name, type, label, placeholder, error, control }) => (
        <InputField
          key={name}
          control={control}
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
  const queryClient = useQueryClient();

  const dirtyFieldsRef = useRef<Record<string, boolean>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: async (requestBody: TAccountVerificationRequestDto) => {
      const data = await AccountVerificationRepository.initiate(requestBody);
      return data;
    },
    onSuccess: () => {
      toast.success("Account verification submitted successfully");
      queryClient.invalidateQueries({
        queryKey: ["account-verification-status"]
      });
    }
  });

  return (
    <Form
      render={(control, { errors, isSubmitting, dirtyFields }) => {
        dirtyFieldsRef.current = dirtyFields;
        const nidFields = [
          {
            name: "nidFrontImage",
            type: "file",
            label: "NID Front Image",
            error: errors.nidFrontImage,
            control: control
          },
          {
            name: "nidBackImage",
            type: "file",
            label: "NID Back Image",
            error: errors.nidBackImage,
            control: control
          },
          {
            name: "nidNumber",
            type: "text",
            label: "NID No.",
            placeholder: "e.g. 5110981456895",
            error: errors.nidNumber,
            control: control
          }
        ];

        const passportFields = [
          {
            name: "passportImage",
            type: "file",
            label: "Passport Image",
            error: errors.passportImage,
            control: control
          },
          {
            name: "passportNumber",
            type: "text",
            label: "Passport No.",
            placeholder: "e.g. AC110058145611",
            error: errors.passportNumber,
            control: control
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
              <Button type="submit" isLoading={isSubmitting || isPending}>
                Submit
              </Button>
            </div>
          </div>
        );
      }}
      validationSchema={AccountVerificationSchema}
      onSubmitCallback={async (data) => {
        const changedFields = Object.keys(dirtyFieldsRef.current).reduce(
          (acc, field) => {
            acc[field] = (data as Record<string, any>)[field];
            return acc;
          },
          {} as Record<string, any>
        );
        mutate(changedFields as TAccountVerificationRequestDto);
      }}
    />
  );
};

export default AccountVerificationForm;
