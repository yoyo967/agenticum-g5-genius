const getOrigin = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') return 'http://localhost:8080';
    // 🌐 AGENTICUM G5 — DECENTRALIZED BACKEND LINK (Standardized)
    return 'https://agenticum-backend-697051612685.europe-west1.run.app';
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getOrigin() + '/api/v1';
export const WS_BASE_URL = getOrigin().replace('http', 'ws') + '/api/v1/genius/ws';
export const ENGINE_URL = getOrigin();
