export const PUBLIC_PAGE_ROUTE = {
  HOME: "/"
};

export const PRIVATE_PAGE_ROUTE = {
  SETTINGS_PERSONAL_INFO: "/account-preferences/personal-info"
};

export const PRIVATE_ADMIN_ONLY_PAGE_ROUTE: Record<string, string> = {
  ADMIN_DASHBOARD: "/admin",
  APPROVAL_HOST_VERIFICATION: "/admin/approvals/host",
  APPROVAL_ACCOUNT_VERIFICATION: "/admin/approvals/account-verification"
} as const;

export const PRIVATE_TRAVELER_ONLY_PAGE_ROUTE: Record<string, string> = {
  SETTINGS_VERIFICATION: "/account-preferences/verification"
} as const;
