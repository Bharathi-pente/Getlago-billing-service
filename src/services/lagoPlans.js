const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create plan in Lago
 * @param {Object} planData - Plan data
 * @returns {Promise<Object>} Created plan
 */
async function createPlan(planData) {
  try {
    logger.info('Creating plan in Lago', {
      name: planData.name,
      code: planData.code,
    });

    const response = await lagoClient.plans.createPlan({
      plan: planData,
    });

    logger.info('Plan created in Lago', {
      name: planData.name,
      code: planData.code,
      lago_id: response.plan?.lago_id,
    });

    return response.plan;
  } catch (error) {
    logger.error('Failed to create plan in Lago', {
      name: planData.name,
      code: planData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get plan by code
 * @param {string} code - Plan code
 * @returns {Promise<Object>} Plan data
 */
async function getPlan(code) {
  try {
    logger.debug('Fetching plan from Lago', { code });

    const response = await lagoClient.plans.findPlan(code);

    logger.debug('Plan fetched from Lago', { code });

    return response.plan;
  } catch (error) {
    logger.error('Failed to fetch plan from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update plan in Lago
 * @param {string} code - Plan code
 * @param {Object} planData - Updated plan data
 * @returns {Promise<Object>} Updated plan
 */
async function updatePlan(code, planData) {
  try {
    logger.info('Updating plan in Lago', { code });

    const response = await lagoClient.plans.updatePlan(code, {
      plan: planData,
    });

    logger.info('Plan updated in Lago', { code });

    return response.plan;
  } catch (error) {
    logger.error('Failed to update plan in Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete plan from Lago
 * @param {string} code - Plan code
 * @returns {Promise<void>}
 */
async function deletePlan(code) {
  try {
    logger.info('Deleting plan from Lago', { code });

    await lagoClient.plans.destroyPlan(code);

    logger.info('Plan deleted from Lago', { code });
  } catch (error) {
    logger.error('Failed to delete plan from Lago', {
      code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all plans
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Plans list with meta
 */
async function listPlans(params = {}) {
  try {
    logger.debug('Fetching plans from Lago', params);

    const response = await lagoClient.plans.findAllPlans(params);

    logger.debug('Plans fetched from Lago', {
      count: response.plans?.length || 0,
    });

    return {
      plans: response.plans || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch plans from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
  listPlans,
};
