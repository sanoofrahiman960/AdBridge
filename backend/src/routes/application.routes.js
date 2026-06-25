const crypto = require('crypto');
const express = require('express');

const asyncHandler = require('../lib/async-handler');
const { createHttpError } = require('../lib/http-error');
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../store');
const { serializeApplication } = require('../utils/serializers');
const { assertEnum, assertRequiredFields } = require('../utils/validators');

const router = express.Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const data = await db.read();
    let applications;

    if (req.user.role === 'advertiser') {
      const campaignIds = data.campaigns
        .filter((campaign) => campaign.advertiserId === req.user.id)
        .map((campaign) => campaign.id);

      applications = data.applications.filter((application) =>
        campaignIds.includes(application.campaignId)
      );
    } else {
      applications = data.applications.filter((application) => application.creatorId === req.user.id);
    }

    res.json({
      items: applications.map((application) =>
        serializeApplication(application, data.users, data.campaigns, data.creatorProfiles)
      ),
    });
  })
);

router.post(
  '/campaigns/:campaignId',
  authenticate,
  authorize('creator'),
  asyncHandler(async (req, res) => {
    assertRequiredFields(req.body, ['pitch', 'proposedFee', 'timelineDays']);

    const application = await db.transaction((data) => {
      const campaign = data.campaigns.find((item) => item.id === req.params.campaignId);

      if (!campaign) {
        throw createHttpError(404, 'Campaign not found.');
      }

      if (campaign.status !== 'open') {
        throw createHttpError(400, 'This campaign is not accepting applications.');
      }

      const existingApplication = data.applications.find(
        (item) => item.campaignId === campaign.id && item.creatorId === req.user.id
      );

      if (existingApplication) {
        throw createHttpError(409, 'You have already applied to this campaign.');
      }

      const hasProfile = data.creatorProfiles.some((item) => item.userId === req.user.id);

      if (!hasProfile) {
        throw createHttpError(400, 'Create your creator profile before applying.');
      }

      const now = new Date().toISOString();
      const nextApplication = {
        id: crypto.randomUUID(),
        campaignId: campaign.id,
        creatorId: req.user.id,
        pitch: String(req.body.pitch).trim(),
        proposedFee: Number(req.body.proposedFee),
        timelineDays: Number(req.body.timelineDays),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };

      data.applications.push(nextApplication);
      return nextApplication;
    });

    res.status(201).json({
      application,
    });
  })
);

router.patch(
  '/:applicationId/status',
  authenticate,
  authorize('advertiser'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    assertRequiredFields(req.body, ['status']);
    assertEnum(status, ['pending', 'shortlisted', 'accepted', 'rejected'], 'status');

    const application = await db.transaction((data) => {
      const nextApplication = data.applications.find(
        (item) => item.id === req.params.applicationId
      );

      if (!nextApplication) {
        throw createHttpError(404, 'Application not found.');
      }

      const campaign = data.campaigns.find((item) => item.id === nextApplication.campaignId);

      if (!campaign || campaign.advertiserId !== req.user.id) {
        throw createHttpError(403, 'You can only manage applications for your campaigns.');
      }

      nextApplication.status = status;
      nextApplication.updatedAt = new Date().toISOString();
      return nextApplication;
    });

    res.json({
      application,
    });
  })
);

module.exports = router;
