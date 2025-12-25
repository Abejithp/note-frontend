import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from './config';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for handling token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Prevent infinite refresh loops
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
          originalRequest._retry = true;

          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refresh_token: refreshToken,
              });

              const { access_token } = response.data;
                const accessTokenToStore = typeof access_token === 'string' ? access_token : JSON.stringify(access_token);
                await SecureStore.setItemAsync('accessToken', accessTokenToStore);
                this.accessToken = accessTokenToStore;

                originalRequest.headers.Authorization = `Bearer ${accessTokenToStore}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await this.logout();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async setAuthToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  async loadAuthToken() {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      await this.setAuthToken(token);
    }
  }

  async logout() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    this.accessToken = null;
    delete this.client.defaults.headers.common.Authorization;
  }

  getClient() {
    return this.client;
  }
}

export const apiClient = new ApiClient();
