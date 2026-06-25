export type ApiUserRole = "advertiser" | "creator";
export type AppUserRole = "advertiser" | "provider";

export type AuthUser = {
  city?: string;
  companyName?: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: ApiUserRole;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type HealthResponse = {
  service: string;
  status: string;
  timestamp: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  city?: string;
  companyName?: string;
  email: string;
  name: string;
  password: string;
  role: ApiUserRole;
};

export type Campaign = {
  advertiser?: AuthUser | null;
  advertiserId: string;
  applicationsCount: number;
  brandName: string;
  budgetMax: number;
  budgetMin: number;
  createdAt: string;
  creatorRequirements: string[];
  deliverables: string[];
  description: string;
  id: string;
  objectives: string[];
  platforms: string[];
  status: string;
  title: string;
  updatedAt: string;
};

export type CreatorPlatform = {
  engagementRate: number;
  followers: number;
  name: string;
};

export type CreatorProfile = {
  bio: string;
  categories: string[];
  createdAt: string;
  displayName: string;
  handle: string;
  id: string;
  platforms: CreatorPlatform[];
  rateCardMin: number;
  updatedAt: string;
  user?: AuthUser | null;
  userId: string;
  verified: boolean;
};

export type Application = {
  campaign?: Campaign | null;
  campaignId: string;
  createdAt: string;
  creator?: AuthUser | null;
  creatorId: string;
  creatorProfile?: CreatorProfile | null;
  id: string;
  pitch: string;
  proposedFee: number;
  status: string;
  timelineDays: number;
  updatedAt: string;
};

export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "accepted"
  | "rejected";

export type CampaignListResponse = {
  items: Campaign[];
};

export type CampaignResponse = {
  campaign: Campaign;
};

export type CreatorListResponse = {
  items: CreatorProfile[];
};

export type ApplicationListResponse = {
  items: Application[];
};

export type ApplicationResponse = {
  application: Application;
};

export type CurrentUserResponse = {
  user: AuthUser;
};

export type CurrentCreatorProfileResponse = {
  profile: CreatorProfile | null;
};

export type CreatorProfileResponse = {
  profile: CreatorProfile;
};

export type CreateCampaignPayload = {
  brandName: string;
  budgetMax: number;
  budgetMin: number;
  creatorRequirements?: string[];
  deliverables?: string[];
  description: string;
  objectives?: string[];
  platforms?: string[];
  status?: string;
  title: string;
};

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export type UpsertCreatorProfilePayload = {
  bio: string;
  categories?: string[];
  displayName: string;
  handle: string;
  platforms?: CreatorPlatform[];
  rateCardMin?: number;
  verified?: boolean;
};

export type CreateApplicationPayload = {
  pitch: string;
  proposedFee: number;
  timelineDays: number;
};
