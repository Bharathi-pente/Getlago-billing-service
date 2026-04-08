const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Get organization details
 * @returns {Promise<Object>} Organization data
 */
async function getOrganization() {
  try {
    logger.debug('Fetching organization from Lago');

    const response = await lagoClient.organizations.findOrganization();

    logger.debug('Organization fetched from Lago');

    return response.organization;
  } catch (error) {
    logger.error('Failed to fetch organization from Lago', {
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update organization details
 * @param {Object} organizationData - Updated organization data
 * @returns {Promise<Object>} Updated organization
 */
async function updateOrganization(organizationData) {
  try {
    logger.info('Updating organization in Lago');

    const response = await lagoClient.organizations.updateOrganization({
      organization: organizationData,
    });

    logger.info('Organization updated in Lago');

    return response.organization;
  } catch (error) {
    logger.error('Failed to update organization in Lago', {
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  getOrganization,
  updateOrganization,
};
