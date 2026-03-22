import { EVENT_TAG } from "../../server/enums/event-tags.enum";

export const EVENT_TAG_VALUES = Object.values(EVENT_TAG);

export function formatEventTagLabel(tag: string): string {
  return tag
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function parseEventTagInput(raw: string): EVENT_TAG | null {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (!normalized) return null;
  return EVENT_TAG_VALUES.includes(normalized as EVENT_TAG)
    ? (normalized as EVENT_TAG)
    : null;
}
