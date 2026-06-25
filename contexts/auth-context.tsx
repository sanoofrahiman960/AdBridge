import React, { createContext, useContext, useEffect, useState } from "react";

import {
  fetchCurrentUser,
  getApiErrorMessage,
  loginRequest,
  registerRequest,
} from "@/lib/api-client";
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "@/lib/session-storage";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types/api";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean;
  login: (credentials: LoginPayload) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  token: string | null;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const clearPersistedSession = async () => {
    try {
      await clearAuthSession();
    } catch {
      // Ignore storage cleanup failures and keep in-memory auth state authoritative.
    }
  };

  const persistAuthSession = async (nextToken: string, nextUser: AuthUser) => {
    try {
      await writeAuthSession({
        token: nextToken,
        user: nextUser,
      });
    } catch {
      // Ignore persistence failures so sign-in still succeeds during storage issues.
    }
  };

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      try {
        const storedSession = await readAuthSession();

        if (!storedSession) {
          return;
        }

        const refreshedUser = await fetchCurrentUser(storedSession.token);

        if (!isActive) {
          return;
        }

        setToken(storedSession.token);
        setUser(refreshedUser);
        await persistAuthSession(storedSession.token, refreshedUser);
      } catch {
        if (isActive) {
          setToken(null);
          setUser(null);
        }

        await clearPersistedSession();
      } finally {
        if (isActive) {
          setIsReady(true);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const applyAuthSession = async (response: AuthResponse) => {
    setToken(response.token);
    setUser(response.user);
    await persistAuthSession(response.token, response.user);
    return response.user;
  };

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);

    try {
      const response = await loginRequest(credentials);
      return await applyAuthSession(response);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);

    try {
      const response = await registerRequest(payload);
      return await applyAuthSession(response);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    void clearPersistedSession();
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    setIsLoading(true);

    try {
      const refreshedUser = await fetchCurrentUser(token);
      setUser(refreshedUser);
      await persistAuthSession(token, refreshedUser);
      return refreshedUser;
    } catch (error) {
      logout();
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token && user),
        isLoading,
        isReady,
        login,
        logout,
        refreshUser,
        register,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
