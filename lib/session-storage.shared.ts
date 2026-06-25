import type { AuthUser } from "@/types/api";

export const AUTH_SESSION_KEY = "adbridge.auth.session";

export type StoredAuthSession = {
  token: string;
  user: AuthUser;
};

export function parseStoredAuthSession(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<StoredAuthSession>;

    if (
      typeof parsedValue.token !== "string" ||
      !parsedValue.user ||
      typeof parsedValue.user !== "object" ||
      typeof parsedValue.user.id !== "string"
    ) {
      return null;
    }

    return parsedValue as StoredAuthSession;
  } catch {
    return null;
  }
}

export function serializeStoredAuthSession(session: StoredAuthSession) {
  return JSON.stringify(session);
}
