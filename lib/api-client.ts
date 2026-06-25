import axios from "axios";

import { API_BASE_URL } from "@/constants/api";
import type {
  ApplicationResponse,
  ApplicationStatus,
  ApplicationListResponse,
  AuthResponse,
  CampaignResponse,
  CampaignListResponse,
  CreateApplicationPayload,
  CreateCampaignPayload,
  CreatorListResponse,
  CurrentCreatorProfileResponse,
  CurrentUserResponse,
  CreatorProfileResponse,
  HealthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateCampaignPayload,
  UpsertCreatorProfilePayload,
} from "@/types/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

function getAuthConfig(token?: string) {
  if (!token) {
    return undefined;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again.";
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the API.";
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function fetchHealth() {
  const { data } = await apiClient.get<HealthResponse>("/api/health");
  return data;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>(
    "/api/auth/register",
    payload,
  );
  return data;
}

export async function fetchCurrentUser(token: string) {
  const { data } = await apiClient.get<CurrentUserResponse>(
    "/api/auth/me",
    getAuthConfig(token),
  );
  return data.user;
}

export async function fetchCampaigns() {
  const { data } = await apiClient.get<CampaignListResponse>("/api/campaigns");
  return data.items;
}

export async function fetchCampaign(campaignId: string) {
  const { data } = await apiClient.get<CampaignResponse>(
    `/api/campaigns/${campaignId}`,
  );
  return data.campaign;
}

export async function fetchMyCampaigns(token: string) {
  const { data } = await apiClient.get<CampaignListResponse>(
    "/api/campaigns/mine/listings",
    getAuthConfig(token),
  );
  return data.items;
}

export async function createCampaign(
  token: string,
  payload: CreateCampaignPayload,
) {
  const { data } = await apiClient.post<{ campaign: { id: string } }>(
    "/api/campaigns",
    payload,
    getAuthConfig(token),
  );
  return data.campaign;
}

export async function updateCampaign(
  token: string,
  campaignId: string,
  payload: UpdateCampaignPayload,
) {
  const { data } = await apiClient.patch<CampaignResponse>(
    `/api/campaigns/${campaignId}`,
    payload,
    getAuthConfig(token),
  );
  return data.campaign;
}

export async function fetchCreators() {
  const { data } = await apiClient.get<CreatorListResponse>("/api/creators");
  return data.items;
}

export async function fetchMyCreatorProfile(token: string) {
  const { data } = await apiClient.get<CurrentCreatorProfileResponse>(
    "/api/creators/me",
    getAuthConfig(token),
  );
  return data.profile;
}

export async function upsertCreatorProfile(
  token: string,
  payload: UpsertCreatorProfilePayload,
) {
  const { data } = await apiClient.put<CreatorProfileResponse>(
    "/api/creators/me",
    payload,
    getAuthConfig(token),
  );
  return data.profile;
}

export async function fetchApplications(token: string) {
  const { data } = await apiClient.get<ApplicationListResponse>(
    "/api/applications",
    getAuthConfig(token),
  );
  return data.items;
}

export async function createApplication(
  token: string,
  campaignId: string,
  payload: CreateApplicationPayload,
) {
  const { data } = await apiClient.post<ApplicationResponse>(
    `/api/applications/campaigns/${campaignId}`,
    payload,
    getAuthConfig(token),
  );
  return data.application;
}

export async function updateApplicationStatus(
  token: string,
  applicationId: string,
  status: ApplicationStatus,
) {
  const { data } = await apiClient.patch<ApplicationResponse>(
    `/api/applications/${applicationId}/status`,
    { status },
    getAuthConfig(token),
  );
  return data.application;
}
