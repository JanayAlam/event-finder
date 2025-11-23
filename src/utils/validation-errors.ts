import { StringMap } from "@/app/_types/common/mappers";
import { ZodError } from "zod";

export const convertZodErrors = (err: ZodError): StringMap => {
  return err.issues.reduce((acc: StringMap, issue) => {
    const key =
      typeof issue.path[0] === "string" ? issue.path[0] : String(issue.path[0]);
    acc[key] = issue.message;
    return acc;
  }, {});
};
