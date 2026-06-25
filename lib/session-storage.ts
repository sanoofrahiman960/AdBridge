import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import {
  AUTH_SESSION_KEY,
  parseStoredAuthSession,
  serializeStoredAuthSession,
  type StoredAuthSession,
} from "@/lib/session-storage.shared";

function getWebStorage() {
  if (typeof globalThis === "undefined" || !("localStorage" in globalThis)) {
    return null;
  }

  return globalThis.localStorage;
}

export async function readAuthSession() {
  if (Platform.OS === "web") {
    return parseStoredAuthSession(
      getWebStorage()?.getItem(AUTH_SESSION_KEY) ?? null,
    );
  }

  const rawValue = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
  return parseStoredAuthSession(rawValue);
}

export async function writeAuthSession(session: StoredAuthSession) {
  const serializedSession = serializeStoredAuthSession(session);

  if (Platform.OS === "web") {
    getWebStorage()?.setItem(AUTH_SESSION_KEY, serializedSession);
    return;
  }

  await SecureStore.setItemAsync(AUTH_SESSION_KEY, serializedSession);
}

export async function clearAuthSession() {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(AUTH_SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}
