"use client";

import ImageInput from "@/components/shared/atoms/inputs/image-input";
import EFCard from "@/components/shared/molecules/ef-card";
import {
  InputField,
  ItineraryFormFields,
  TextareaField
} from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import LocationRepository from "@/repositories/location.repository";
import { PUBLIC_DYNAMIC_PAGE_ROUTE, PUBLIC_PAGE_ROUTE } from "@/routes";
import { TPlaceOption } from "@/types/location/location.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  CalendarClockIcon,
  Camera,
  Images,
  Info,
  Map,
  NotebookText,
  PiggyBank,
  PlusIcon
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { TCreateEventDto, TCreateEventForm } from "../../../../common/types";
import { CreateEventSchema } from "../../../../common/validation-schemas";

const FormCard: React.FC<
  PropsWithChildren<{
    icon: React.ReactNode;
    title: string;
    action?: React.ReactNode;
    subtitle: string;
  }>
> = ({ icon, title, action, subtitle, children }) => {
  return (
    <EFCard
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <H4 className="font-bold">{title}</H4>
          </div>
          {action ? action : null}
        </div>
      }
      description={subtitle}
    >
      {children}
    </EFCard>
  );
};

interface ICreateEventFormProps {
  initialData?: Partial<TCreateEventForm>;
  onCancel?: () => void;
  draftId?: string;
}

export const CreateEventForm: React.FC<ICreateEventFormProps> = ({
  initialData,
  onCancel,
  draftId
}) => {
  const router = useRouter();

  const [placeOptions, setPlaceOptions] = useState<TPlaceOption[]>(
    LocationRepository.getCuratedPlaceOptions()
  );
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

  const form = useForm<TCreateEventForm>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      placeName: initialData?.placeName || "",
      eventDate: initialData?.eventDate || undefined,
      entryFee: initialData?.entryFee || undefined,
      memberCapacity: initialData?.memberCapacity || undefined,
      dayCount: initialData?.dayCount ?? undefined,
      nightCount: initialData?.nightCount ?? undefined,
      itinerary: initialData?.itinerary || [],
      coverPhoto: initialData?.coverPhoto || undefined,
      additionalPhotos: initialData?.additionalPhotos || []
    }
  });

  const {
    fields: additionalPhotosFields,
    append: appendPhoto,
    remove: removePhoto
  } = useFieldArray({
    control: form.control,
    name: "additionalPhotos"
  });

  const { mutateAsync: createEvent, isPending: isCreating } = useMutation({
    mutationFn: async (data: TCreateEventDto) => {
      const result = await EventRepository.create(data, { draftId });
      return result;
    },
    onSuccess: (data) => {
      toast.success("Event created successfully");
      router.push(PUBLIC_DYNAMIC_PAGE_ROUTE.EVENT_DETAILS(data._id.toString()));
    },
    onError: () => {
      toast.error("Failed to create event");
    }
  });

  const [coverResetKey, setCoverResetKey] = React.useState(0);
  const { mutate: uploadCover, isPending: isUploadingCover } = useMutation({
    mutationFn: (file: File) => EventRepository.uploadCoverPhoto(file),
    onSuccess: (data) => {
      form.setValue("coverPhoto", data.path);
    },
    onError: () => {
      toast.error("Failed to upload cover photo");
      form.setValue("coverPhoto", "");
      setCoverResetKey((prev) => prev + 1);
    }
  });

  const [uploadingAdditionalIndex, setUploadingAdditionalIndex] =
    React.useState<number | null>(null);

  const { mutate: uploadAdditional } = useMutation({
    mutationFn: (file: File) => EventRepository.uploadAdditionalPhoto(file),
    onSuccess: (data) => {
      const index = uploadingAdditionalIndex;
      if (index !== null) {
        form.setValue(`additionalPhotos.${index}.path`, data.path);
      }
    },
    onError: (err) => {
      toast.error(
        isAxiosError(err)
          ? err.response?.data.message || "Failed to upload photo"
          : "Failed to upload photo"
      );
      if (uploadingAdditionalIndex !== null) {
        removePhoto(uploadingAdditionalIndex);
      }
    },
    onSettled: () => setUploadingAdditionalIndex(null)
  });

  const { mutate: removePhotoOnServer } = useMutation({
    mutationFn: (path: string) => EventRepository.removePhoto(path),
    onError: () => toast.error("Failed to remove photo from server")
  });

  useEffect(() => {
    let active = true;

    const fetchCountriesAndCities = async () => {
      try {
        setIsLoadingPlaces(true);
        const normalizedOptions = await LocationRepository.getPlaceOptions();
        if (!active) return;
        setPlaceOptions(normalizedOptions);
      } catch {
        if (active) {
          setPlaceOptions(LocationRepository.getCuratedPlaceOptions());
        }
      } finally {
        if (active) {
          setIsLoadingPlaces(false);
        }
      }
    };

    fetchCountriesAndCities();

    return () => {
      active = false;
    };
  }, []);

  const handleGoToHomepageAction = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    router.push(PUBLIC_PAGE_ROUTE.HOME);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCover(file);
    }
  };

  const handleAdditionalChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAdditionalIndex(index);
      uploadAdditional(file);
    }
  };

  const handleRemoveAdditionalPhoto = async (index: number) => {
    const path = form.getValues(`additionalPhotos.${index}.path`);
    if (path) {
      removePhotoOnServer(path);
    }
    removePhoto(index);
  };

  const handleRemoveCoverPhoto = () => {
    const path = form.getValues("coverPhoto");
    if (path) {
      removePhotoOnServer(path);
    }
    form.setValue("coverPhoto", "");
    setCoverResetKey((prev) => prev + 1);
  };

  return (
    <Form
      render={(control, { errors, isSubmitting }) => {
        return (
          <div className="flex flex-col gap-4 w-full">
            <FormCard
              icon={<Map />}
              title="Basic Information"
              subtitle="Tell us about your trip event"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
                  <div className="flex flex-col gap-4">
                    <InputField
                      isRequired
                      control={control}
                      type="text"
                      label="Event Title"
                      name="title"
                      placeholder="e.g., Weekend Mountain Hiking Adventure"
                    />
                    <InputField
                      isRequired
                      control={control}
                      type="editable-select"
                      label="Place"
                      name="placeName"
                      placeholder={
                        isLoadingPlaces
                          ? "Loading city, country options..."
                          : "e.g., Saint Martin Island, Bangladesh"
                      }
                      options={placeOptions}
                    />
                    <TextareaField
                      isRequired
                      control={control}
                      name="description"
                      label="Description"
                      placeholder="Describe your trip event, what to expect, what to bring..."
                      className="h-25"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Paragraph className="text-sm font-medium">
                        Cover Photo
                      </Paragraph>
                    </div>
                    <ImageInput
                      key={coverResetKey}
                      name="coverPhoto"
                      onChange={handleCoverChange}
                      onRemove={
                        form.watch("coverPhoto")
                          ? handleRemoveCoverPhoto
                          : undefined
                      }
                      isLoading={isUploadingCover}
                      value={form.watch("coverPhoto")}
                      ratio={0.5}
                      className="h-full min-h-[140px]"
                    />
                    {errors.coverPhoto && (
                      <Paragraph className="text-[12px] font-medium text-destructive">
                        {errors.coverPhoto.message as string}
                      </Paragraph>
                    )}
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard
              icon={<CalendarClockIcon />}
              title="Schedule & Duration"
              subtitle="When is the event and how long will it last?"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField
                      isRequired
                      control={control}
                      type="datetime-local"
                      label="Event Date"
                      name="eventDate"
                    />
                    <InputField
                      isRequired
                      control={control}
                      type="number"
                      label="Days"
                      name="dayCount"
                      placeholder="e.g., 2"
                    />
                    <InputField
                      isRequired
                      control={control}
                      type="number"
                      label="Nights"
                      name="nightCount"
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div className="grid grid-cols-[16px_1fr] gap-2 sm:items-center">
                    <Info className="h-4 w-4 text-muted-foreground max-sm:mt-1!" />
                    <TypographyMuted>
                      Provide the duration of your event by specifying the days
                      and nights.
                    </TypographyMuted>
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard
              icon={<PiggyBank />}
              title="Fees & Members"
              subtitle="What is the entry fee and member capacity?"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  isRequired
                  control={control}
                  type="number"
                  label="Entry Fee"
                  name="entryFee"
                  placeholder="e.g., 7500"
                />
                <InputField
                  control={control}
                  type="number"
                  label="Member Capacity"
                  name="memberCapacity"
                  placeholder="e.g., 30"
                />
              </div>
            </FormCard>

            <FormCard
              icon={<Images />}
              title="Additional Photos"
              subtitle="Show us more about the place and activities (at most 5 photos)"
              action={
                additionalPhotosFields.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendPhoto({ path: "" })}
                  >
                    <PlusIcon />
                    Add photo
                  </Button>
                )
              }
            >
              <div className="flex flex-col gap-4">
                {additionalPhotosFields.length === 0 ? (
                  <EFCard bodyClassName="flex flex-col gap-2 items-center">
                    <Camera className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                    <TypographyMuted className="text-muted-foreground text-center">
                      No additional photos added
                    </TypographyMuted>
                    <TypographyMuted className="text-sm text-muted-foreground/60 text-center">
                      Click &quot;Add photo&quot; to add photos
                    </TypographyMuted>
                  </EFCard>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {additionalPhotosFields.map((field, index) => (
                      <div key={field.id} className="relative group">
                        <ImageInput
                          onChange={(e) => handleAdditionalChange(index, e)}
                          onRemove={() => handleRemoveAdditionalPhoto(index)}
                          isLoading={uploadingAdditionalIndex === index}
                          value={form.watch(`additionalPhotos.${index}.path`)}
                          ratio={1}
                          className="aspect-square"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {errors.additionalPhotos && (
                  <Paragraph className="text-[12px] font-medium text-destructive">
                    {errors.additionalPhotos.message as string}
                  </Paragraph>
                )}
              </div>
            </FormCard>

            <FormCard
              icon={<NotebookText />}
              title="Itinerary"
              subtitle="Add activities and schedule for your trip (optional)"
            >
              <ItineraryFormFields control={control} />
            </FormCard>

            <EFCard>
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="px-6 max-xs:flex-1"
                  onClick={handleGoToHomepageAction}
                  disabled={isSubmitting || isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="px-6 max-xs:flex-1 bg-primary hover:bg-primary/90 dark:text-primary"
                  isLoading={isSubmitting || isCreating}
                >
                  Create
                </Button>
              </div>
            </EFCard>
          </div>
        );
      }}
      validationSchema={CreateEventSchema}
      form={form}
      onSubmitCallback={async (data) => {
        await createEvent(data);
      }}
      onInvalidCallback={(errors) => {
        const firstError = Object.values(errors)[0] as { message?: string };
        toast.error(firstError?.message || "Please fix form errors first");
      }}
    />
  );
};
