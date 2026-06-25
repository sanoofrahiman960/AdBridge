const crypto = require('crypto');
const express = require('express');

const asyncHandler = require('../lib/async-handler');
const { createHttpError } = require('../lib/http-error');
const { authenticate, authorize } = require('../middleware/auth');
const db = require('../store');
const { serializeCreatorProfile } = require('../utils/serializers');
const { assertRequiredFields } = require('../utils/validators');

const router = express.Router();

function normalizeProfilePayload(payload, existingProfile) {
  const nextProfile = existingProfile ? { ...existingProfile } : {};

  const simpleFields = ['handle', 'displayName', 'bio'];
  const numberFields = ['rateCardMin'];

  for (const field of simpleFields) {
    if (payload[field] !== undefined) {
      nextProfile[field] = String(payload[field]).trim();
    }
  }

  if (payload.categories !== undefined) {
    nextProfile.categories = Array.isArray(payload.categories) ? payload.categories : [];
  }

  if (payload.platforms !== undefined) {
    nextProfile.platforms = Array.isArray(payload.platforms) ? payload.platforms : [];
  }

  for (const field of numberFields) {
    if (payload[field] !== undefined) {
      nextProfile[field] = Number(payload[field]);
    }
  }

  if (payload.verified !== undefined) {
    nextProfile.verified = Boolean(payload.verified);
  }

  nextProfile.updatedAt = new Date().toISOString();
  return nextProfile;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const data = await db.read();

    res.json({
      items: data.creatorProfiles.map((profile) => serializeCreatorProfile(profile, data.users)),
    });
  })
);

router.get(
  '/me',
  authenticate,
  authorize('creator'),
  asyncHandler(async (req, res) => {
    const data = await db.read();
    const profile = data.creatorProfiles.find((item) => item.userId === req.user.id);

    res.json({
      profile: profile ? serializeCreatorProfile(profile, data.users) : null,
    });
  })
);

router.get(
  '/:creatorId',
  asyncHandler(async (req, res) => {
    const data = await db.read();
    const profile = data.creatorProfiles.find((item) => item.userId === req.params.creatorId);

    if (!profile) {
      throw createHttpError(404, 'Creator profile not found.');
    }

    res.json({
      profile: serializeCreatorProfile(profile, data.users),
    });
  })
);

router.put(
  '/me',
  authenticate,
  authorize('creator'),
  asyncHandler(async (req, res) => {
    assertRequiredFields(req.body, ['handle', 'displayName', 'bio']);

    const profile = await db.transaction((data) => {
      const existingProfile = data.creatorProfiles.find((item) => item.userId === req.user.id);
      const normalizedProfile = normalizeProfilePayload(req.body, existingProfile);

      if (existingProfile) {
        Object.assign(existingProfile, normalizedProfile);
        return existingProfile;
      }

      const now = new Date().toISOString();
      const nextProfile = {
        id: crypto.randomUUID(),
        userId: req.user.id,
        handle: normalizedProfile.handle,
        displayName: normalizedProfile.displayName,
        bio: normalizedProfile.bio,
        categories: normalizedProfile.categories || [],
        platforms: normalizedProfile.platforms || [],
        rateCardMin: normalizedProfile.rateCardMin || 0,
        verified: Boolean(normalizedProfile.verified),
        createdAt: now,
        updatedAt: now,
      };

      data.creatorProfiles.push(nextProfile);
      return nextProfile;
    });

    const refreshedData = await db.read();

    res.json({
      profile: serializeCreatorProfile(profile, refreshedData.users),
    });
  })
);

module.exports = router;
