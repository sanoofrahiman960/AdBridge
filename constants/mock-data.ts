export type DashboardRole = "advertiser" | "provider";
export type MetricAccent = "primary" | "success" | "warning";

export type MetricItem = {
  accent: MetricAccent;
  icon: string;
  label: string;
  value: string;
};

export type ProjectSummary = {
  ctaLabel: string;
  meta: string;
  progress?: number;
  status: string;
  title: string;
  value: string;
};

export type ProviderSummary = {
  audience: string;
  name: string;
  rating: string;
  specialty: string;
};

export type AccountItem = {
  icon: string;
  subtitle: string;
  title: string;
};

export const campaignObjectives = ["Awareness", "Traffic", "Leads"] as const;
export type CampaignObjective = (typeof campaignObjectives)[number];

export const campaignFilters = ["Drafts", "Scheduled", "Completed"] as const;
export type CampaignFilter = (typeof campaignFilters)[number];

export const dashboardMetricsByRole: Record<DashboardRole, MetricItem[]> = {
  advertiser: [
    {
      accent: "primary",
      icon: "rocket-launch",
      label: "Active Campaigns",
      value: "12",
    },
    {
      accent: "success",
      icon: "visibility",
      label: "Live Reach",
      value: "1.2M",
    },
    {
      accent: "warning",
      icon: "payments",
      label: "Spend",
      value: "$14.2k",
    },
    { accent: "primary", icon: "bolt", label: "CTR", value: "4.2%" },
  ],
  provider: [
    {
      accent: "primary",
      icon: "assignment-late",
      label: "Open Briefs",
      value: "24",
    },
    {
      accent: "success",
      icon: "mark-email-read",
      label: "Pending Bids",
      value: "08",
    },
    {
      accent: "warning",
      icon: "payments",
      label: "Revenue",
      value: "$6.8k",
    },
    {
      accent: "primary",
      icon: "thumb-up-off-alt",
      label: "Acceptance",
      value: "87%",
    },
  ],
};

export const dashboardCardsByRole: Record<DashboardRole, ProjectSummary[]> = {
  advertiser: [
    {
      ctaLabel: "Manage campaign",
      meta: "Video - Kerala launch burst",
      progress: 0.72,
      status: "Live",
      title: "Monsoon awareness sprint",
      value: "$14.2k",
    },
    {
      ctaLabel: "Review providers",
      meta: "Retail - In-store screens",
      progress: 0.41,
      status: "Scaling",
      title: "Weekend retail activation",
      value: "$8.9k",
    },
  ],
  provider: [
    {
      ctaLabel: "Bid now",
      meta: "E-commerce - 3 short-form placements",
      status: "Open",
      title: "UGC showcase for product reveal",
      value: "$1,500",
    },
    {
      ctaLabel: "Send proposal",
      meta: "Local retail - Outdoor signage",
      status: "Invite",
      title: "Festival storefront campaign",
      value: "$3,200",
    },
  ],
};

export const topProviders: ProviderSummary[] = [
  {
    audience: "240k highly engaged lifestyle audience",
    name: "Lana Admin",
    rating: "4.9",
    specialty: "Lifestyle creator - Reels and stories",
  },
  {
    audience: "190k B2B and startup community",
    name: "Ravi Joseph",
    rating: "4.8",
    specialty: "Newsletter + founder content",
  },
];

export const campaignCards: ProjectSummary[] = [
  {
    ctaLabel: "Open brief",
    meta: "Briefing - Needs targeting + creative",
    progress: 0.3,
    status: "Draft",
    title: "Launch monsoon awareness",
    value: "$6,500",
  },
  {
    ctaLabel: "Review assets",
    meta: "Media buying - Awaiting provider approvals",
    progress: 0.58,
    status: "Scheduled",
    title: "Retail activation weekender",
    value: "$8,000",
  },
  {
    ctaLabel: "View wrap-up",
    meta: "Performance - Final report ready",
    progress: 1,
    status: "Completed",
    title: "Founders stories spotlight",
    value: "$3,200",
  },
];

export const accountItems: AccountItem[] = [
  {
    icon: "notifications-none",
    title: "Notifications",
    subtitle: "Campaign updates, bid alerts, and daily summaries",
  },
  {
    icon: "security",
    title: "Security",
    subtitle: "Two-factor auth and session controls",
  },
  {
    icon: "payments",
    title: "Billing & payouts",
    subtitle: "Invoices, card methods, and provider settlements",
  },
];
