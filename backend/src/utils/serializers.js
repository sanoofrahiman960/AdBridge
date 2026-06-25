function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function serializeCreatorProfile(profile, users) {
  const owner = users.find((user) => user.id === profile.userId);

  return {
    ...profile,
    user: sanitizeUser(owner),
  };
}

function serializeCampaign(campaign, users, applications) {
  const owner = users.find((user) => user.id === campaign.advertiserId);

  return {
    ...campaign,
    advertiser: sanitizeUser(owner),
    applicationsCount: applications.filter((application) => application.campaignId === campaign.id)
      .length,
  };
}

function serializeApplication(application, users, campaigns, profiles) {
  const creator = users.find((user) => user.id === application.creatorId);
  const campaign = campaigns.find((item) => item.id === application.campaignId);
  const profile = profiles.find((item) => item.userId === application.creatorId);

  return {
    ...application,
    creator: sanitizeUser(creator),
    creatorProfile: profile || null,
    campaign: campaign || null,
  };
}

module.exports = {
  sanitizeUser,
  serializeApplication,
  serializeCampaign,
  serializeCreatorProfile,
};
