"use client";

import Form from "@/components/shared/organisms/form";
import React from "react";

const PersonalInfoForm: React.FC = () => {
  return (
    <Form
      fields={[
        [
          {
            label: "Given name",
            name: "firstName",
            type: "text",
            placeholder: "e.g. Anika Anmol",
            value: ""
          },
          {
            label: "Family name",
            name: "lastName",
            type: "text",
            placeholder: "e.g. Sara",
            value: "Sara"
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
      ]}
      onSubmitCallback={async (data) => {
        console.log(data);
      }}
    />
  );
};

export default PersonalInfoForm;
