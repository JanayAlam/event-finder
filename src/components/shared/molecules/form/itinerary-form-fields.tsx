"use client";

import EFCard from "@/components/shared/molecules/ef-card";
import { Button } from "@/components/shared/shadcn-components/button";
import {
  Paragraph,
  TypographyMuted
} from "@/components/shared/shadcn-components/typography";
import { ClipboardList, PlusIcon, Trash2 } from "lucide-react";
import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import InputField from "./input-field";
import TextareaField from "./textarea-field";

interface ItineraryFormFieldsProps {
  /** The react-hook-form control from the parent form */
  control: Control<any>;
  /** Name of the itinerary field-array in the form (defaults to "itinerary") */
  fieldArrayName?: string;
}

/**
 * Reusable itinerary field-array UI.
 * Drives its own useFieldArray internally so the parent only needs to pass `control`.
 */
export const ItineraryFormFields: React.FC<ItineraryFormFieldsProps> = ({
  control,
  fieldArrayName = "itinerary"
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName
  });

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Add activity button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              moment: "",
              title: "",
              description: ""
            })
          }
        >
          <PlusIcon className="size-4" />
          Add activity
        </Button>
      </div>

      {/* Empty state */}
      {!fields.length ? (
        <EFCard bodyClassName="flex flex-col gap-2 items-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <TypographyMuted className="text-muted-foreground text-center">
            No activities added yet
          </TypographyMuted>
          <TypographyMuted className="text-sm text-muted-foreground/60 text-center">
            Click &quot;Add activity&quot; to create your itinerary
          </TypographyMuted>
        </EFCard>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <EFCard key={field.id} bodyClassName="flex flex-col gap-4">
              {/* Activity header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-input/25 text-primary font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <Paragraph>Activity {index + 1}</Paragraph>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </div>

              {/* Activity fields */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    isRequired
                    control={control}
                    type="datetime-local"
                    label="Date & Time"
                    name={`${fieldArrayName}.${index}.moment`}
                  />
                  <InputField
                    isRequired
                    control={control}
                    type="text"
                    label="Activity Title"
                    name={`${fieldArrayName}.${index}.title`}
                    placeholder="e.g., Morning Hike to Summit"
                  />
                </div>
                <TextareaField
                  control={control}
                  name={`${fieldArrayName}.${index}.description`}
                  label="Description"
                  placeholder="Describe what will happen during this activity..."
                  className="h-25"
                />
              </div>
            </EFCard>
          ))}
        </div>
      )}
    </div>
  );
};
