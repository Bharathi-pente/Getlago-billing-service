const lagoClient = require('../config/lago');
const logger = require('../utils/logger');

/**
 * Create resource in Lago
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>} Created resource
 */
async function createResource(resourceData) {
  try {
    logger.info('Creating resource in Lago', {
      name: resourceData.name,
      code: resourceData.code,
    });

    const response = await lagoClient.resources.createResource({
      resource: resourceData,
    });

    logger.info('Resource created in Lago', {
      name: resourceData.name,
      code: resourceData.code,
      lago_id: response.resource?.lago_id,
    });

    return response.resource;
  } catch (error) {
    logger.error('Failed to create resource in Lago', {
      name: resourceData.name,
      code: resourceData.code,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Get resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object>} Resource data
 */
async function getResource(id) {
  try {
    logger.debug('Fetching resource from Lago', { id });

    const response = await lagoClient.resources.findResource(id);

    logger.debug('Resource fetched from Lago', { id });

    return response.resource;
  } catch (error) {
    logger.error('Failed to fetch resource from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Update resource in Lago
 * @param {string} id - Resource ID
 * @param {Object} resourceData - Updated resource data
 * @returns {Promise<Object>} Updated resource
 */
async function updateResource(id, resourceData) {
  try {
    logger.info('Updating resource in Lago', { id });

    const response = await lagoClient.resources.updateResource(id, {
      resource: resourceData,
    });

    logger.info('Resource updated in Lago', { id });

    return response.resource;
  } catch (error) {
    logger.error('Failed to update resource in Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * Delete resource from Lago
 * @param {string} id - Resource ID
 * @returns {Promise<void>}
 */
async function deleteResource(id) {
  try {
    logger.info('Deleting resource from Lago', { id });

    await lagoClient.resources.destroyResource(id);

    logger.info('Resource deleted from Lago', { id });
  } catch (error) {
    logger.error('Failed to delete resource from Lago', {
      id,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

/**
 * List all resources
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Resources list with meta
 */
async function listResources(params = {}) {
  try {
    logger.debug('Fetching resources from Lago', params);

    const response = await lagoClient.resources.findAllResources(params);

    logger.debug('Resources fetched from Lago', {
      count: response.resources?.length || 0,
    });

    return {
      resources: response.resources || [],
      meta: response.meta || {},
    };
  } catch (error) {
    logger.error('Failed to fetch resources from Lago', {
      params,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

module.exports = {
  createResource,
  getResource,
  updateResource,
  deleteResource,
  listResources,
};
