export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
export const BASE_ENDPOINT = "/api";
export const LOG_ENDPOINT = `${BASE_ENDPOINT}/log`;
export const LOG_SEARCH_ENDPOINT = `${LOG_ENDPOINT}/search`;

// If you want a function for ID-based routes:
export const getLogByIdEndpoint = (id: number) => `${LOG_ENDPOINT}/${id}`;