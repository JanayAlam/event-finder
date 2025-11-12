/**
 * Utility to get and cache the access and refresh tokens from cookies
 * Since cookies are httpOnly, we need to fetch them via a Next.js API route
 */

interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
}

let tokenCache: TokenData | null = null;
let tokenPromise: Promise<TokenData> | null = null;

/**
 * Fetches both access and refresh tokens from the /api/auth/me endpoint
 * Uses caching to avoid repeated API calls
 */
async function fetchTokens(): Promise<TokenData> {
  // Return cached tokens if available
  if (tokenCache) {
    return tokenCache;
  }

  // If there's already a request in progress, wait for it
  if (tokenPromise) {
    return tokenPromise;
  }

  // Fetch tokens from API route
  tokenPromise = fetch("/api/v1/auth/me", {
    credentials: "include"
  })
    .then(async (response) => {
      if (!response.ok) {
        tokenCache = { accessToken: null, refreshToken: null };
        return tokenCache;
      }

      const data = await response.json();
      const tokens: TokenData = {
        accessToken: data?.accessToken || null,
        refreshToken: data?.refreshToken || null
      };
      tokenCache = tokens;
      return tokens;
    })
    .catch(() => {
      tokenCache = { accessToken: null, refreshToken: null };
      return tokenCache;
    })
    .finally(() => {
      tokenPromise = null;
    });

  return tokenPromise;
}

/**
 * Fetches the access token from the /api/auth/me endpoint
 * Uses caching to avoid repeated API calls
 */
export async function getAccessToken(): Promise<string | null> {
  const tokens = await fetchTokens();
  return tokens.accessToken;
}

/**
 * Fetches the refresh token from the /api/auth/me endpoint
 * Uses caching to avoid repeated API calls
 */
export async function getRefreshToken(): Promise<string | null> {
  const tokens = await fetchTokens();
  return tokens.refreshToken;
}

/**
 * Fetches both access and refresh tokens together
 * Uses caching to avoid repeated API calls
 */
export async function getTokens(): Promise<TokenData> {
  return fetchTokens();
}

/**
 * Clears the cached tokens (useful after logout)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  tokenPromise = null;
}
