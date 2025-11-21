"use client";

import { dateOptional, stringRequired } from "@/app/_validation-schemas";
import Form, { TFormProps } from "@/components/shared/organisms/form";
import React, { useMemo } from "react";
import { z } from "zod";

const PersonalInfoFormSchema = z.object({
  givenName: stringRequired("Given name"),
  familyName: stringRequired("Family name"),
  dateOfBirth: dateOptional()
});

const PersonalInfoForm: React.FC = () => {
  const fields: TFormProps<typeof PersonalInfoFormSchema>["fields"] = useMemo(
    () => [
      [
        {
          label: "Given name",
          name: "givenName",
          type: "text",
          placeholder: "e.g. Anika Anmol",
          value: ""
        },
        {
          label: "Family name",
          name: "familyName",
          type: "text",
          placeholder: "e.g. Sara",
          value: ""
        }
      ],
      [
        {
          label: "Date of birth",
          name: "dateOfBirth",
          type: "date",
          value: undefined
        },
        null
      ]
    ],
    []
  );

  return (
    <Form
      fields={fields}
      validationSchema={PersonalInfoFormSchema}
      onSubmitCallback={async (data) => {
        console.log(data);
      }}
    />
  );
};

export default PersonalInfoForm;
