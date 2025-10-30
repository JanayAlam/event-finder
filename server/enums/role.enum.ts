export const USER_ROLE = {
  ADMIN: "admin",
  TRAVELLER: "traveller"
} as const;

export const userRoles = Object.values(USER_ROLE);

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
