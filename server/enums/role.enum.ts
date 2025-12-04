export const USER_ROLE = {
  ADMIN: "admin",
  HOST: "host",
  TRAVELER: "traveler"
} as const;

export const userRoles = Object.values(USER_ROLE);

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
