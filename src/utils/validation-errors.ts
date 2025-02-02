import { StringMap } from "@/app/_types/common/mappers";
import { ZodError } from "zod";

export const convertZodErrors = (err: ZodError): StringMap => {
  return err.issues.reduce((acc: StringMap, issue) => {
    acc[issue.path[0]] = issue.message;
    return acc;
  }, {});
};
