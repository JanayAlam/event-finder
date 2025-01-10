export const REDIS_KEY = {
  REFRESH_TOKEN: "rt" as const
};

export type TRedisKey = (typeof REDIS_KEY)[keyof typeof REDIS_KEY];
