import axios from 'axios';
import Config from 'react-native-config';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(config => {
  const apiKey = Config.TMDB_API_KEY;
  if (apiKey) {
    config.params = {
      ...config.params,
      api_key: apiKey,
    };
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
