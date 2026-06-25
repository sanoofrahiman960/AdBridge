const DEFAULT_API_BASE_URL = 'https://adbridge-2woq.onrender.com';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export function apiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
