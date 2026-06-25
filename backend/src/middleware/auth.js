const jwt = require('jsonwebtoken');

const config = require('../config');
const { createHttpError } = require('../lib/http-error');
const db = require('../store');

async function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(createHttpError(401, 'Authorization token required.'));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const data = await db.read();
    const user = data.users.find((item) => item.id === payload.sub);

    if (!user) {
      throw createHttpError(401, 'User for token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Invalid or expired token.'));
      return;
    }

    next(error);
  }
}

function authorize(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      next(createHttpError(401, 'Authentication required.'));
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      next(createHttpError(403, 'You do not have access to this resource.'));
      return;
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
