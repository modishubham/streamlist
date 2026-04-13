import axios from 'axios';
import {TMDB_BASE_URL, TMDB_ACCESS_TOKEN} from '@env';

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(config => {
  if (TMDB_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  }
  return config;
});

client.interceptors.response.use(
  response => response,
  error => {
    if (__DEV__) {
      console.warn('[API Error]', error?.response?.status, error?.message);
    }
    return Promise.reject(error);
  },
);

export default client;
