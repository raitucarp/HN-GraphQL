export const REQUEST_CACHE_TTL: number = parseInt(
  process.env.REQUEST_CACHE_TTL ?? (5 * 60).toString()
);

export const REDIS_CONNECTION_STRING =
  process.env.REDIS_CONNECTION_STRING || "redis://localhost:6379";
