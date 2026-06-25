const config = require('./config');
const FileDatabase = require('./lib/file-db');
const { createSeedData } = require('./data/seed-data');

module.exports = new FileDatabase(config.dataFile, createSeedData);
