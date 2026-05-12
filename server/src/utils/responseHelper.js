/**
 * sendSuccess - Standard success response
 * @param {object} res - Express response object
 * @param {object|array|null} data - Payload to return
 * @param {string} message - Human readable message
 * @param {number} statusCode - HTTP status (default 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * sendError - Standard error response
 * @param {object} res - Express response object
 * @param {string} error - Error description
 * @param {string} code - Error code constant (e.g. 'USER_NOT_FOUND')
 * @param {number} statusCode - HTTP status (default 400)
 */
const sendError = (res, error = 'Something went wrong', code = 'INTERNAL_ERROR', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
    code,
  });
};

module.exports = { sendSuccess, sendError };
