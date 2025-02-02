import { BooleanMap, StringMap } from "../common/mappers";

export interface AdminLoginFormState<T> {
  errors?: StringMap;
  data?: T;
  blurs?: BooleanMap;
}
