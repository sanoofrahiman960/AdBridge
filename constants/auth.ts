import type { ApiUserRole, AppUserRole } from "@/types/api";

export const demoCredentialsByRole: Record<
  AppUserRole,
  { email: string; password: string }
> = {
  advertiser: {
    email: "brand@adbridge.demo",
    password: "password123",
  },
  provider: {
    email: "creator@adbridge.demo",
    password: "password123",
  },
};

export function apiRoleToAppRole(role: ApiUserRole): AppUserRole {
  return role === "creator" ? "provider" : "advertiser";
}

export function appRoleToApiRole(role: AppUserRole): ApiUserRole {
  return role === "provider" ? "creator" : "advertiser";
}

export function getRoleLabel(role: ApiUserRole | AppUserRole) {
  return role === "creator" || role === "provider" ? "Provider" : "Advertiser";
}
