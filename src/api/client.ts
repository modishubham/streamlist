import axios, {InternalAxiosRequestConfig, isAxiosError} from 'axios';
import {TMDB_ACCESS_TOKEN, TMDB_BASE_URL} from '@env';

export interface NormalizedApiError {
  message: string;
  status: number | null;
}

export class ApiClientError extends Error implements NormalizedApiError {
  status: number | null;

  constructor({message, status}: NormalizedApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

type RetryableConfig = InternalAxiosRequestConfig & {__retryCount?: number};

function parseServerMessage(data: unknown): string | undefined {
  if (data && typeof data === 'object' && 'status_message' in data) {
    const msg = (data as {status_message?: unknown}).status_message;
    if (typeof msg === 'string' && msg.trim()) {
      return msg;
    }
  }
  return undefined;
}

export function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }
  if (isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const message =
      parseServerMessage(error.response?.data) ||
      error.message ||
      'Request failed';
    return new ApiClientError({message, status});
  }
  if (error instanceof Error) {
    return new ApiClientError({message: error.message, status: null});
  }
  return new ApiClientError({message: 'Something went wrong', status: null});
}

function isNetworkFailure(error: unknown): boolean {
  if (axios.isCancel(error)) {
    return false;
  }
  if (!isAxiosError(error)) {
    return false;
  }
  return error.response === undefined;
}

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
  async error => {
    const config = error.config as RetryableConfig | undefined;
    if (!config) {
      return Promise.reject(toApiClientError(error));
    }
    if (config.__retryCount === undefined) {
      config.__retryCount = 0;
    }
    const mayRetry =
      config.__retryCount < 1 && isNetworkFailure(error) && !axios.isCancel(error);
    if (mayRetry) {
      config.__retryCount += 1;
      // #region agent log
      console.log('[DBG-ad497a] client.ts:retry |', JSON.stringify({url:config.url,retryCount:config.__retryCount}));
      // #endregion
      return client.request(config);
    }
    return Promise.reject(toApiClientError(error));
  },
);

export default client;
