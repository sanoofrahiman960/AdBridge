const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = 'password123';

const advertiserUserId = 'user_adv_nimbus';
const creatorUserId = 'user_creator_maya';

function timestamp() {
  return new Date().toISOString();
}

function createSeedData() {
  const now = timestamp();

  return {
    users: [
      {
        id: advertiserUserId,
        name: 'Aarav Mehta',
        email: 'brand@adbridge.demo',
        passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
        role: 'advertiser',
        companyName: 'Nimbus Labs',
        createdAt: now,
      },
      {
        id: creatorUserId,
        name: 'Maya Sharma',
        email: 'creator@adbridge.demo',
        passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
        role: 'creator',
        city: 'Bengaluru',
        createdAt: now,
      },
    ],
    creatorProfiles: [
      {
        id: 'profile_maya',
        userId: creatorUserId,
        handle: '@maya.builds',
        displayName: 'Maya Builds',
        bio: 'Startup and fintech creator making practical explainers for founders.',
        categories: ['fintech', 'startups', 'productivity'],
        platforms: [
          {
            name: 'Instagram',
            followers: 48000,
            engagementRate: 4.8,
          },
          {
            name: 'YouTube',
            followers: 17000,
            engagementRate: 5.2,
          },
        ],
        rateCardMin: 300,
        verified: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    campaigns: [
      {
        id: 'campaign_nimbus_launch',
        advertiserId: advertiserUserId,
        title: 'Nimbus Business Card Launch',
        brandName: 'Nimbus Labs',
        description:
          'Looking for creators who can explain how founders use Nimbus to manage team spend and cashback.',
        budgetMin: 500,
        budgetMax: 1500,
        platforms: ['Instagram', 'YouTube'],
        objectives: ['awareness', 'conversions'],
        deliverables: ['1 reel', '3 story frames'],
        creatorRequirements: ['India-based audience', 'startup or finance niche'],
        status: 'open',
        createdAt: now,
        updatedAt: now,
      },
    ],
    applications: [
      {
        id: 'application_nimbus_maya',
        campaignId: 'campaign_nimbus_launch',
        creatorId: creatorUserId,
        pitch:
          'I can turn this into a founder workflow story that feels useful instead of salesy.',
        proposedFee: 650,
        timelineDays: 7,
        status: 'shortlisted',
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

module.exports = {
  DEMO_PASSWORD,
  createSeedData,
  demoUsers: {
    advertiser: {
      email: 'brand@adbridge.demo',
      password: DEMO_PASSWORD,
    },
    creator: {
      email: 'creator@adbridge.demo',
      password: DEMO_PASSWORD,
    },
  },
};
