/**
 * Shared pagination + sorting helpers.
 *
 * Response envelope for every collection endpoint:
 *   { items, page, page_size, total, pages }
 */

/** Parse + clamp page/page_size query params with sane defaults. */
const pagination = (query, { defaultSize = 50, maxSize = 100 } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const pageSize = Math.min(maxSize, Math.max(1, parseInt(query.page_size, 10) || defaultSize));
  return { page, pageSize, skip: (page - 1) * pageSize };
};

/**
 * Parse ?sort=field or ?sort=-field (descending) against an explicit
 * whitelist. Never pass raw client input to .sort().
 */
const sortFromQuery = (raw, allowedFields) => {
  if (!raw || typeof raw !== "string") return {};
  const desc = raw.startsWith("-");
  const field = desc ? raw.slice(1) : raw;
  if (!allowedFields.has(field)) return {};
  return { [field]: desc ? -1 : 1 };
};

module.exports = { pagination, sortFromQuery };
