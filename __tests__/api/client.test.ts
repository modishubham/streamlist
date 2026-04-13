import {AxiosError, type InternalAxiosRequestConfig} from 'axios';
import {ApiClientError, toApiClientError} from '../../src/api/client';

const dummyConfig = {} as InternalAxiosRequestConfig;

describe('toApiClientError', () => {
  it('maps TMDB status_message and HTTP status', () => {
    const err = new AxiosError('Network');
    err.response = {
      data: {status_message: 'Invalid API key'},
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: dummyConfig,
    };
    const normalized = toApiClientError(err);
    expect(normalized).toBeInstanceOf(ApiClientError);
    expect(normalized.message).toBe('Invalid API key');
    expect(normalized.status).toBe(401);
  });

  it('uses axios message when no status_message', () => {
    const err = new AxiosError('timeout of 15000ms exceeded');
    err.response = {
      data: {},
      status: 500,
      statusText: 'Error',
      headers: {},
      config: dummyConfig,
    };
    const normalized = toApiClientError(err);
    expect(normalized.status).toBe(500);
    expect(normalized.message).toContain('15000');
  });

  it('uses null status for network failures without response', () => {
    const err = new AxiosError('Network Error');
    err.response = undefined;
    const normalized = toApiClientError(err);
    expect(normalized.status).toBeNull();
 });

  it('passes through ApiClientError', () => {
    const original = new ApiClientError({message: 'x', status: 400});
    expect(toApiClientError(original)).toBe(original);
  });
});
