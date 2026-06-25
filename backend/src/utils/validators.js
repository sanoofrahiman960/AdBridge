const { createHttpError } = require('../lib/http-error');

function assertRequiredFields(payload, fields) {
  const missingFields = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    throw createHttpError(400, 'Missing required fields.', { missingFields });
  }
}

function assertEnum(value, validValues, fieldName) {
  if (!validValues.includes(value)) {
    throw createHttpError(400, `Invalid ${fieldName}.`, {
      allowedValues: validValues,
    });
  }
}

module.exports = {
  assertEnum,
  assertRequiredFields,
};
