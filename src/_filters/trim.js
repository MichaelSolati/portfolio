/**
 * @param {string} [content]
 * @param {number} [length]
 * @returns {string}
 */
const trim = (content = '', length = 140) =>
  (content || '').length < length
    ? content
    : content.substring(0, length - 3) + '...';

module.exports = {trim};
