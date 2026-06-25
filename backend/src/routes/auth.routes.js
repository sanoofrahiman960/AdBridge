const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const asyncHandler = require('../lib/async-handler');
const { createHttpError } = require('../lib/http-error');
const { authenticate } = require('../middleware/auth');
const db = require('../store');
const { sanitizeUser } = require('../utils/serializers');
const { assertEnum, assertRequiredFields } = require('../utils/validators');

const router = express.Router();

function createAuthPayload(user) {
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      subject: user.id,
      expiresIn: '7d',
    }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, role, companyName, city } = req.body;

    assertRequiredFields(req.body, ['name', 'email', 'password', 'role']);
    assertEnum(role, ['advertiser', 'creator'], 'role');

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.transaction((data) => {
      const emailTaken = data.users.some((item) => item.email === normalizedEmail);

      if (emailTaken) {
        throw createHttpError(409, 'An account with this email already exists.');
      }

      const nextUser = {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
      };

      if (companyName) {
        nextUser.companyName = String(companyName).trim();
      }

      if (city) {
        nextUser.city = String(city).trim();
      }

      data.users.push(nextUser);
      return nextUser;
    });

    res.status(201).json(createAuthPayload(user));
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    assertRequiredFields(req.body, ['email', 'password']);

    const normalizedEmail = String(email).trim().toLowerCase();
    const data = await db.read();
    const user = data.users.find((item) => item.email === normalizedEmail);

    if (!user) {
      throw createHttpError(401, 'Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw createHttpError(401, 'Invalid email or password.');
    }

    res.json(createAuthPayload(user));
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      user: sanitizeUser(req.user),
    });
  })
);

module.exports = router;
