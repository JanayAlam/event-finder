"use client";

import Form from "@/components/shared/organisms/form";
import AuthRepository from "@/repositories/auth.repository";
import ProfileRepository from "@/repositories/profile.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import { TProfile } from "../../../../../server/models/profile.model";
import {
  PersonalInfoRequestSchema,
  TPersonalInfoRequestDto
} from "../../../../../validation-schemas";

const PersonalInfoForm: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => AuthRepository.getMyProfile(),
    retry: false
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (requestBody: TPersonalInfoRequestDto) => {
      if (!profile?._id) {
        return;
      }
      const data = await ProfileRepository.updatePersonalInfo(
        profile._id.toString(),
        requestBody
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Personal information updated successfully");
      queryClient.setQueryData(["my-profile"], (old: TProfile) => ({
        ...old,
        ...data
      }));
    }
  });

  return (
    <Form
      isLoading={isLoading}
      defaultValues={{
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        dateOfBirth: profile?.dateOfBirth
          ? dayjs(profile.dateOfBirth).format("YYYY-MM-DD")
          : undefined
      }}
      fields={[
        [
          {
            label: "Given name",
            name: "firstName",
            type: "text",
            placeholder: "e.g. Anika Anmol",
            isRequired: true
          },
          {
            label: "Family name",
            name: "lastName",
            type: "text",
            placeholder: "e.g. Sara",
            isRequired: true
          }
        ],
        [
          {
            label: "Date of birth",
            name: "dateOfBirth",
            type: "date"
          },
          null
        ]
      ]}
      validationSchema={PersonalInfoRequestSchema}
      submitButtonLabel="Save"
      onSubmitCallback={async (data) => mutate(data)}
      isSubmitButtonLoading={isPending}
    />
  );
};

export default PersonalInfoForm;
