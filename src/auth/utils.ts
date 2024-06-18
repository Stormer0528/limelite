import { CONFIG } from 'src/config';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function getTimeToLive(accessToken: string | null | undefined) {
  if (!accessToken) {
    return 0;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return 0;
    }

    const timeToLive = decoded.exp * 1000 - Date.now();
    // if it exceeds setTimeout's maximum limit, don't createTimer
    if (timeToLive >= 2147483646) {
      return 2147483646;
    }

    return timeToLive;
  } catch (error) {
    console.error('Error during token validation:', error);
    return 0;
  }
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null) {
  if (accessToken) {
    localStorage.setItem(CONFIG.storageTokenKey, accessToken);
  } else {
    localStorage.removeItem(CONFIG.storageTokenKey);
  }
}

// ----------------------------------------------------------------------

export function getSession() {
  const accessToken = localStorage.getItem(CONFIG.storageTokenKey);
  return accessToken;
}
