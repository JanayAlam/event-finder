export const PUBLIC_PAGE_ROUTE = {
  HOME: "/",
  EXPLORE: "/explore",
  AI: "/ai"
};

export const PUBLIC_DYNAMIC_PAGE_ROUTE = {
  EVENT_DETAILS: (eventId: string) => `/events/view/${eventId}`,
  PROFILE: (profileId: string) => `/profiles/${profileId}`
};

export const PRIVATE_PAGE_ROUTE = {
  SETTINGS_PERSONAL_INFO: "/account-preferences/personal-info"
};

export const PRIVATE_ADMIN_ONLY_PAGE_ROUTE: Record<string, string> = {
  ADMIN_DASHBOARD: "/admin",
  APPROVAL_HOST_VERIFICATION: "/admin/approvals/host",
  APPROVAL_ACCOUNT_VERIFICATION: "/admin/approvals/account-verification",
  FACEBOOK_INTEGRATION: "/admin/facebook",
  USER_MANAGEMENT: "/admin/users"
} as const;

export const PRIVATE_HOST_ONLY_PAGE_ROUTE: Record<string, string> = {
  CREATE_EVENT: "/events/create"
} as const;

export const PRIVATE_TRAVELER_ONLY_PAGE_ROUTE: Record<string, string> = {
  SETTINGS_VERIFICATION: "/account-preferences/verification"
} as const;
