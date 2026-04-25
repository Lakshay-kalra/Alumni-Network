const DEPLOYED_BACKEND_URL = 'https://alumni-network-backend-ix93.onrender.com';

const cleanUrl = (url = '') => url.replace(/\/$/, '');

export const API_BASE_URL = cleanUrl(
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : DEPLOYED_BACKEND_URL)
);

export const SOCKET_BASE_URL = cleanUrl(
  import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? window.location.origin : DEPLOYED_BACKEND_URL)
);

export const apiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
