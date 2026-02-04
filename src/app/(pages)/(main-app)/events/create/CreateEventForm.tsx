"use client";
import ImageInput from "@/components/shared/atoms/inputs/ImageInput";
import Card from "@/components/shared/molecules/card";
import { InputField, TextareaField } from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import EventRepository from "@/repositories/event.repository";
import { PUBLIC_DYNAMIC_PAGE_ROUTE, PUBLIC_PAGE_ROUTE } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  CalendarClockIcon,
  Camera,
  ClipboardList,
  Images,
  Info,
  Map,
  NotebookText,
  PiggyBank,
  PlusIcon,
  Trash2
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React, { PropsWithChildren } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateEventSchema,
  TCreateEventDto
} from "../../../../../../common/validation-schemas";

const FormCard: React.FC<
  PropsWithChildren<{
    icon: React.ReactNode;
    title: string;
    action?: React.ReactNode;
    subtitle: string;
  }>
> = ({ icon, title, action, subtitle, children }) => {
  return (
    <Card
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
    </Card>
  );
};

export default function CreateEventForm() {
  const router = useRouter();

  const form = useForm<TCreateEventDto>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      placeName: "",
      eventDate: undefined,
      entryFee: undefined,
      memberCapacity: undefined,
      dayCount: undefined,
      nightCount: undefined,
      itinerary: [],
      coverPhoto: undefined,
      additionalPhotos: []
    }
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary
  } = useFieldArray({
    control: form.control,
    name: "itinerary"
  });

  const {
    fields: additionalPhotosFields,
    append: appendPhoto,
    remove: removePhoto
  } = useFieldArray({
    control: form.control,
    name: "additionalPhotos"
  });

  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: async (data: TCreateEventDto) => {
      const result = await EventRepository.create(data);
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
        form.setValue(`additionalPhotos.${index}`, data.path);
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

  const handleGoToHomepageAction = () => {
    router.push(PUBLIC_PAGE_ROUTE.HOME);
  };

  const handleRemoveItinerary = (index: number) => {
    removeItinerary(index);
    setTimeout(() => {
      form.clearErrors("itinerary");
    }, 0);
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
    const path = form.getValues(`additionalPhotos.${index}`);
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
      render={(register, { errors, isSubmitting }) => {
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
                      register={register("title")}
                      type="text"
                      label="Event Title"
                      name="title"
                      placeholder="e.g., Weekend Mountain Hiking Adventure"
                      error={errors.title}
                    />
                    <InputField
                      isRequired
                      register={register("placeName")}
                      type="text"
                      label="Place"
                      name="placeName"
                      placeholder="e.g., Saint Martin Island, Bangladesh"
                      error={errors.placeName}
                    />
                    <TextareaField
                      isRequired
                      register={register("description")}
                      name="description"
                      label="Description"
                      placeholder="Describe your trip event, what to expect, what to bring..."
                      error={errors.description}
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
                      onRemove={handleRemoveCoverPhoto}
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
                      register={register("eventDate")}
                      type="datetime-local"
                      label="Event Date"
                      name="eventDate"
                      error={errors.eventDate}
                    />
                    <InputField
                      isRequired
                      register={register("dayCount")}
                      type="number"
                      label="Days"
                      name="dayCount"
                      placeholder="e.g., 2"
                      error={errors.dayCount}
                    />
                    <InputField
                      isRequired
                      register={register("nightCount")}
                      type="number"
                      label="Nights"
                      name="nightCount"
                      placeholder="e.g., 3"
                      error={errors.nightCount}
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
                  register={register("entryFee")}
                  type="number"
                  label="Entry Fee"
                  name="entryFee"
                  placeholder="e.g., 7500"
                  error={errors.entryFee}
                />
                <InputField
                  register={register("memberCapacity")}
                  type="number"
                  label="Member Capacity"
                  name="memberCapacity"
                  placeholder="e.g., 30"
                  error={errors.memberCapacity}
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
                    onClick={() => appendPhoto(null as any)}
                  >
                    <PlusIcon />
                    Add photo
                  </Button>
                )
              }
            >
              <div className="flex flex-col gap-4">
                {additionalPhotosFields.length === 0 ? (
                  <Card bodyClassName="flex flex-col gap-2 items-center">
                    <Camera className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                    <TypographyMuted className="text-muted-foreground text-center">
                      No additional photos added
                    </TypographyMuted>
                    <TypographyMuted className="text-sm text-muted-foreground/60 text-center">
                      Click &quot;Add photo&quot; to add photos
                    </TypographyMuted>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {additionalPhotosFields.map((field, index) => (
                      <div key={field.id} className="relative group">
                        <ImageInput
                          onChange={(e) => handleAdditionalChange(index, e)}
                          onRemove={() => handleRemoveAdditionalPhoto(index)}
                          isLoading={uploadingAdditionalIndex === index}
                          // eslint-disable-next-line react-hooks/incompatible-library
                          value={form.watch(`additionalPhotos.${index}`)}
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
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendItinerary({
                      moment: new Date(),
                      title: "",
                      description: ""
                    })
                  }
                >
                  <PlusIcon />
                  Add activity
                </Button>
              }
              subtitle="Add activities and schedule for your trip (optional)"
            >
              <div className="flex flex-col gap-2">
                {!itineraryFields.length ? (
                  <Card bodyClassName="flex flex-col gap-2 items-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                    <TypographyMuted className="text-muted-foreground text-center">
                      No activities added yet
                    </TypographyMuted>
                    <TypographyMuted className="text-sm text-muted-foreground/60 text-center">
                      Click &quot;Add activity&quot; to create your itinerary
                    </TypographyMuted>
                  </Card>
                ) : (
                  <div className="flex flex-col gap-3">
                    {itineraryFields.map((field, index) => (
                      <Card key={field.id} bodyClassName="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-primary-foreground text-brand-primary-main font-bold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <Paragraph>Activity {index + 1}</Paragraph>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItinerary(index)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-brand-primary-main" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                              isRequired
                              register={register(`itinerary.${index}.moment`)}
                              type="datetime-local"
                              label="Date & Time"
                              name={`itinerary.${index}.moment`}
                              error={errors.itinerary?.[index]?.moment}
                            />
                            <InputField
                              isRequired
                              register={register(`itinerary.${index}.title`)}
                              type="text"
                              label="Activity Title"
                              name={`itinerary.${index}.title`}
                              placeholder="e.g., Morning Hike to Summit"
                              error={errors.itinerary?.[index]?.title}
                            />
                          </div>
                          <TextareaField
                            register={register(
                              `itinerary.${index}.description`
                            )}
                            name={`itinerary.${index}.description`}
                            label="Description"
                            placeholder="Describe what will happen during this activity..."
                            error={errors.itinerary?.[index]?.description}
                            className="h-25"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </FormCard>

            <Card>
              <div className="flex items-center justify-end gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 max-xs:flex-1"
                  onClick={handleGoToHomepageAction}
                  disabled={isSubmitting || isCreating}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="px-6 max-xs:flex-1 bg-brand-primary-main hover:bg-brand-primary-main/90 dark:text-primary"
                  isLoading={isSubmitting || isCreating}
                >
                  Create
                </Button>
              </div>
            </Card>
          </div>
        );
      }}
      validationSchema={CreateEventSchema}
      onSubmitCallback={(data) => {
        // Clean up itinerary - remove any empty or invalid items
        const cleanedItinerary = (data.itinerary || []).filter(
          (item) => item && item.title && item.moment
        );

        // Clean up additional photos - filter out empty slots
        const cleanedAdditionalPhotos = (data.additionalPhotos || []).filter(
          (path) => typeof path === "string" && path.length > 0
        );

        const cleanedData = {
          ...data,
          itinerary: cleanedItinerary,
          additionalPhotos: cleanedAdditionalPhotos
        };

        createEvent(cleanedData);
      }}
    />
  );
}
