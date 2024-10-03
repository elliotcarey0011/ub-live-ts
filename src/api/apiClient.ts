import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ENV_MODE === 'test' ? 'http://localhost:3000' : 'https://v6.vbb.transport.rest/',
});

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;