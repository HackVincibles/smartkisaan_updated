/**
 * Escapes special characters in a string for use in a regular expression.
 * @param {string} string 
 * @returns {string}
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  escapeRegex,
};
