"use client";

import Card from "@/components/shared/molecules/card";
import { InputField, TextareaField } from "@/components/shared/molecules/form";
import Form from "@/components/shared/organisms/form";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  H4,
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { PUBLIC_PAGE_ROUTE } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClockIcon,
  ClipboardList,
  Info,
  Map,
  NotebookText,
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
      dayCount: undefined,
      nightCount: undefined,
      itinerary: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itinerary"
  });

  const onSubmit = async (_data: TCreateEventDto) => {
    try {
      toast.success("Event created successfully!");
    } catch {
      toast.error("Failed to create event");
    } finally {
    }
  };

  const handleGoToHomepageAction = () => {
    router.push(PUBLIC_PAGE_ROUTE.HOME);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
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
            </FormCard>

            <FormCard
              icon={<CalendarClockIcon />}
              title="Schedule & Duration"
              subtitle="When is the event and how long will it last?"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    register={register("entryFee")}
                    type="number"
                    label="Entry Fee"
                    name="entryFee"
                    placeholder="e.g., 7500"
                    error={errors.entryFee}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              icon={<NotebookText />}
              title="Itinerary"
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ moment: new Date(), title: "", description: "" })
                  }
                >
                  <PlusIcon />
                  Add activity
                </Button>
              }
              subtitle="Add activities and schedule for your trip (optional)"
            >
              <div className="flex flex-col gap-2">
                {!fields.length ? (
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
                    {fields.map((field, index) => (
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
                            onClick={() => remove(index)}
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
                              error={errors.itinerary?.[index]?.moment}
                            />
                          </div>
                          <TextareaField
                            isRequired
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
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="px-6 max-xs:flex-1 bg-brand-primary-main hover:bg-brand-primary-main/90 dark:text-primary"
                  isLoading={isSubmitting}
                >
                  Create
                </Button>
              </div>
            </Card>
          </div>
        );
      }}
      validationSchema={CreateEventSchema}
      onSubmitCallback={async (_data) => {}}
    />
  );
}
