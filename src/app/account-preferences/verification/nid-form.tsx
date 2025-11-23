import Form from "@/components/shared/organisms/form";
import React from "react";

const NIDForm: React.FC = () => {
  return (
    <Form
      fields={[
        [
          {
            label: "NID number",
            name: "nidNumber",
            type: "text",
            placeholder: "e.g. 511 098 145 689",
            isRequired: true
          }
        ]
      ]}
      submitButtonLabel="Save"
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default NIDForm;
