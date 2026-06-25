const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const rawPort = Number(process.env.PORT || 4000);
const rawDataFile = process.env.DATA_FILE;

module.exports = {
  port: Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 4000,
  jwtSecret: process.env.JWT_SECRET || 'adbridge-dev-secret',
  dataFile: rawDataFile
    ? path.resolve(process.cwd(), rawDataFile)
    : path.join(__dirname, '..', 'data', 'db.json'),
};
