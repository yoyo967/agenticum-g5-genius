const getOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:8080';
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || getOrigin();
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || (getOrigin().replace('http', 'ws'));
