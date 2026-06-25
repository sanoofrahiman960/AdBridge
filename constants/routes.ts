import type { Href } from "expo-router";

export const routePaths = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  campaigns: "/explore",
  account: "/account",
  createCampaign: "/create-campaign",
  modal: "/modal",
} as const;

export const routes = {
  home: routePaths.home as Href,
  login: routePaths.login as Href,
  register: routePaths.register as Href,
  dashboard: routePaths.dashboard as Href,
  campaigns: routePaths.campaigns as Href,
  account: routePaths.account as Href,
  createCampaign: routePaths.createCampaign as Href,
  modal: routePaths.modal as Href,
} as const;
