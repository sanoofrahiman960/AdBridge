const crypto = require('crypto');
const express = require('express');

const asyncHandler = require('../lib/async-handler');
const { createHttpError } = require('../lib/http-error');
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../store');
const { serializeCampaign } = require('../utils/serializers');
const { assertRequiredFields } = require('../utils/validators');

const router = express.Router();

function normalizeCampaignPayload(payload, existingCampaign) {
  const nextCampaign = existingCampaign ? { ...existingCampaign } : {};

  const simpleFields = ['title', 'brandName', 'description', 'status'];
  const arrayFields = ['platforms', 'objectives', 'deliverables', 'creatorRequirements'];
  const numberFields = ['budgetMin', 'budgetMax'];

  for (const field of simpleFields) {
    if (payload[field] !== undefined) {
      nextCampaign[field] = String(payload[field]).trim();
    }
  }

  for (const field of arrayFields) {
    if (payload[field] !== undefined) {
      nextCampaign[field] = Array.isArray(payload[field]) ? payload[field] : [];
    }
  }

  for (const field of numberFields) {
    if (payload[field] !== undefined) {
      nextCampaign[field] = Number(payload[field]);
    }
  }

  nextCampaign.updatedAt = new Date().toISOString();
  return nextCampaign;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const data = await db.read();

    res.json({
      items: data.campaigns.map((campaign) =>
        serializeCampaign(campaign, data.users, data.applications)
      ),
    });
  })
);

router.get(
  '/mine/listings',
  authenticate,
  authorize('advertiser'),
  asyncHandler(async (req, res) => {
    const data = await db.read();
    const items = data.campaigns
      .filter((campaign) => campaign.advertiserId === req.user.id)
      .map((campaign) => serializeCampaign(campaign, data.users, data.applications));

    res.json({ items });
  })
);

router.get(
  '/:campaignId',
  asyncHandler(async (req, res) => {
    const data = await db.read();
    const campaign = data.campaigns.find((item) => item.id === req.params.campaignId);

    if (!campaign) {
      throw createHttpError(404, 'Campaign not found.');
    }

    res.json({
      campaign: serializeCampaign(campaign, data.users, data.applications),
    });
  })
);

router.post(
  '/',
  authenticate,
  authorize('advertiser'),
  asyncHandler(async (req, res) => {
    assertRequiredFields(req.body, ['title', 'brandName', 'description']);

    const createdCampaign = await db.transaction((data) => {
      const campaign = normalizeCampaignPayload(req.body);
      const now = new Date().toISOString();

      const nextCampaign = {
        id: crypto.randomUUID(),
        advertiserId: req.user.id,
        title: campaign.title,
        brandName: campaign.brandName,
        description: campaign.description,
        budgetMin: campaign.budgetMin || 0,
        budgetMax: campaign.budgetMax || 0,
        platforms: campaign.platforms || [],
        objectives: campaign.objectives || [],
        deliverables: campaign.deliverables || [],
        creatorRequirements: campaign.creatorRequirements || [],
        status: campaign.status || 'open',
        createdAt: now,
        updatedAt: now,
      };

      data.campaigns.push(nextCampaign);
      return nextCampaign;
    });

    res.status(201).json({
      campaign: createdCampaign,
    });
  })
);

router.patch(
  '/:campaignId',
  authenticate,
  authorize('advertiser'),
  asyncHandler(async (req, res) => {
    const updatedCampaign = await db.transaction((data) => {
      const campaign = data.campaigns.find((item) => item.id === req.params.campaignId);

      if (!campaign) {
        throw createHttpError(404, 'Campaign not found.');
      }

      if (campaign.advertiserId !== req.user.id) {
        throw createHttpError(403, 'You can only edit your own campaigns.');
      }

      const nextCampaign = normalizeCampaignPayload(req.body, campaign);
      Object.assign(campaign, nextCampaign);
      return campaign;
    });

    res.json({
      campaign: updatedCampaign,
    });
  })
);

module.exports = router;
