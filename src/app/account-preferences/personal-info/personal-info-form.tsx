"use client";

import Form, { TFormProps } from "@/components/shared/organisms/form";
import AuthRepository from "@/repositories/auth.repository";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { PersonalInfoRequestSchema } from "../../../../validation-schemas";

const PersonalInfoForm: React.FC = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => AuthRepository.getMyProfile()
  });

  const fields: TFormProps<typeof PersonalInfoRequestSchema>["fields"] = [
    [
      {
        label: "Given name",
        name: "firstName",
        type: "text",
        placeholder: "e.g. Anika Anmol",
        isRequired: true,
        value: profile?.firstName
      },
      {
        label: "Family name",
        name: "lastName",
        type: "text",
        placeholder: "e.g. Sara",
        isRequired: true,
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
  ];

  return (
    <Form
      isLoading={isLoading}
      fields={fields}
      validationSchema={PersonalInfoRequestSchema}
      submitButtonLabel="Save"
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default PersonalInfoForm;
