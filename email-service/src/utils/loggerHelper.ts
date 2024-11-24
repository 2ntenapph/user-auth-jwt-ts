import logger from './logger';

// Log informational messages
export const logInfo = (message: string, meta: object = {}) => {
  logger.info(message, formatMeta(meta));
};

// Log warning messages
export const logWarn = (message: string, meta: object = {}) => {
  logger.warn(message, formatMeta(meta));
};

// Log error messages with detailed error information
export const logError = (message: string, error: any, meta: object = {}) => {
  logger.error(message, { ...formatMeta(meta), error: error?.message, stack: error?.stack });
};

// Helper to format metadata consistently
const formatMeta = (meta: object): object => {
  return {
    timestamp: new Date().toISOString(),
    ...meta,
  };
};
