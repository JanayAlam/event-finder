"use client";

import { dateOptional, stringRequired } from "@/app/_validation-schemas";
import Form, { TFormProps } from "@/components/shared/organisms/form";
import AuthRepository from "@/repositories/auth.repository";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { z } from "zod";

const PersonalInfoFormSchema = z.object({
  firstName: stringRequired("Given name").max(
    20,
    "Given name cannot be longer than 20 characters"
  ),
  lastName: stringRequired("Family name").max(
    15,
    "Family name cannot be longer than 15 characters"
  ),
  dateOfBirth: dateOptional()
});

const PersonalInfoForm: React.FC = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => AuthRepository.getMyProfile()
  });

  const fields: TFormProps<typeof PersonalInfoFormSchema>["fields"] = useMemo(
    () => [
      [
        {
          label: "Given name",
          name: "firstName",
          type: "text",
          placeholder: "e.g. Anika Anmol",
          value: profile?.firstName
        },
        {
          label: "Family name",
          name: "lastName",
          type: "text",
          placeholder: "e.g. Sara",
          value: profile?.lastName
        }
      ],
      [
        {
          label: "Date of birth",
          name: "dateOfBirth",
          type: "date",
          value: profile?.dateOfBirth
        },
        null
      ]
    ],
    [profile]
  );

  return (
    <Form
      isLoading={isLoading}
      fields={fields}
      validationSchema={PersonalInfoFormSchema}
      submitButtonLabel="Save"
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default PersonalInfoForm;
