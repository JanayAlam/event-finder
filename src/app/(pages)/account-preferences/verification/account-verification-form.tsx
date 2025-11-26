"use client";

import Form from "@/components/shared/organisms/form";
import { Separator } from "@/components/shared/shadcn-components/separator";
import {
  H4,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import React from "react";
import { accountVerificationSchema } from "../../../../../validation-schemas";

const AccountVerificationForm: React.FC = () => {
  return (
    <Form
      fields={[
        [
          <div key="nid-verification" className="flex flex-col gap-2 mb-2!">
            <H4>NID information</H4>
            <TypographyMuted>
              Please upload a clear photo of your NID and enter your NID number
            </TypographyMuted>
            <Separator />
          </div>
        ],
        [
          {
            label: "NID front image",
            name: "nidFrontImage",
            type: "file"
          },
          {
            label: "NID back image",
            name: "nidBackImage",
            type: "file"
          }
        ],
        [
          {
            label: "NID number",
            name: "nidNumber",
            type: "text",
            placeholder: "e.g. 511 098 145 689"
          },
          null
        ],
        [
          <div key="nid-verification" className="flex flex-col gap-2 mb-2!">
            <H4>Passport information</H4>
            <TypographyMuted>
              Please upload a clear photo of your passport and enter your
              passport number
            </TypographyMuted>
            <Separator />
          </div>
        ],
        [
          {
            label: "Passport image",
            name: "passportImage",
            type: "file"
          },
          null
        ],
        [
          {
            label: "Passport number",
            name: "passportNumber",
            type: "text",
            placeholder: "e.g. 110058145611"
          },
          null
        ]
      ]}
      submitButtonLabel="Save"
      validationSchema={accountVerificationSchema}
      onSubmitCallback={async (_data) => {}}
    />
  );
};

export default AccountVerificationForm;
