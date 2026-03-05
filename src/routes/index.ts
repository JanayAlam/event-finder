export const PUBLIC_PAGE_ROUTE = {
  HOME: "/",
  EXPLORE: "/explore",
  AI: "/ai"
};

export const PUBLIC_DYNAMIC_PAGE_ROUTE = {
  EVENT_DETAILS: (eventId: string) => `/events/view/${eventId}`,
  PROFILE: (profileId: string) => `/profiles/${profileId}`,
  EXPLORE_EVENTS_BY_HOST: (hostId: string) => `/explore/hosts/${hostId}`
};

export const PRIVATE_PAGE_ROUTE = {
  SETTINGS_PERSONAL_INFO: "/account-preferences/personal-info",
  PAYMENTS: "/payments"
};

export const PRIVATE_ADMIN_ONLY_PAGE_ROUTE: Record<string, string> = {
  ADMIN_DASHBOARD: "/admin",
  APPROVAL_HOST_VERIFICATION: "/admin/approvals/host",
  APPROVAL_ACCOUNT_VERIFICATION: "/admin/approvals/account-verification",
  FACEBOOK_INTEGRATION: "/admin/facebook",
  USER_MANAGEMENT: "/admin/users"
} as const;

export const PRIVATE_HOST_ONLY_PAGE_ROUTE: Record<string, string> = {
  CREATE_EVENT: "/events/create",
  CREATE_EVENT_WITH_AI: "/events/create/ai"
} as const;

export const PRIVATE_TRAVELER_ONLY_PAGE_ROUTE: Record<string, string> = {
  SETTINGS_VERIFICATION: "/account-preferences/verification"
} as const;
