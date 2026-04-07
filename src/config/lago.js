const { Client } = require('lago-javascript-client');
const logger = require('../utils/logger');

const lagoClient = Client(process.env.LAGO_API_KEY, {
  baseUrl: process.env.LAGO_URL,
});

logger.info(`Lago client initialized: ${process.env.LAGO_URL}`);
logger.info(`Lago API Key configured: ${process.env.LAGO_API_KEY ? '***' + process.env.LAGO_API_KEY.slice(-8) : 'NOT SET'}`);

module.exports = lagoClient;
