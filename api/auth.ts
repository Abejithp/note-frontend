import * as SecureStore from 'expo-secure-store';
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const client = apiClient.getClient();
    const response = await client.post<any>(API_ENDPOINTS.AUTH.LOGIN, credentials);

    console.debug('[auth.login] Full response:', JSON.stringify(response.data, null, 2));

    const { access_token, refresh_token, user } = response.data as any;

    if (access_token == null || refresh_token == null) {
      console.error('[auth.login] Missing tokens in response:', response.data);
      throw new Error(`Missing tokens in auth response: ${JSON.stringify(response.data)}`);
    }

    const userData = user || { id: '', email: credentials.email, name: 'User' };
    console.debug('[auth.login] Using user data:', userData);

    const accessTokenToStore = typeof access_token === 'string' ? access_token : JSON.stringify(access_token);
    const refreshTokenToStore = typeof refresh_token === 'string' ? refresh_token : JSON.stringify(refresh_token);

    try {
      await SecureStore.setItemAsync('accessToken', accessTokenToStore);
      await SecureStore.setItemAsync('refreshToken', refreshTokenToStore);
    } catch (err) {
      console.error('Failed to store tokens in SecureStore:', err);
      throw new Error('Failed to save authentication tokens');
    }

    await apiClient.setAuthToken(accessTokenToStore);

    return { access_token, refresh_token, user: userData } as AuthResponse;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const client = apiClient.getClient();
    const response = await client.post<any>(API_ENDPOINTS.AUTH.REGISTER, credentials);

    console.debug('[auth.register] Full response:', JSON.stringify(response.data, null, 2));

    const { access_token, refresh_token, user } = response.data as any;

    if (access_token == null || refresh_token == null) {
      console.error('[auth.register] Missing tokens in response:', response.data);
      throw new Error(`Missing tokens in auth response: ${JSON.stringify(response.data)}`);
    }

    const userData = user || { id: '', email: credentials.email, name: credentials.name };
    console.debug('[auth.register] Using user data:', userData);

    const accessTokenToStore = typeof access_token === 'string' ? access_token : JSON.stringify(access_token);
    const refreshTokenToStore = typeof refresh_token === 'string' ? refresh_token : JSON.stringify(refresh_token);

    try {
      await SecureStore.setItemAsync('accessToken', accessTokenToStore);
      await SecureStore.setItemAsync('refreshToken', refreshTokenToStore);
    } catch (err) {
      console.error('Failed to store tokens in SecureStore:', err, 'tokens:', {
        accessTokenToStore,
        refreshTokenToStore,
      });
      throw new Error('Failed to save authentication tokens: ' + (err as Error).message);
    }

    await apiClient.setAuthToken(accessTokenToStore);

    return { access_token, refresh_token, user: userData } as AuthResponse;
  }

  async logout(): Promise<void> {
    const client = apiClient.getClient();
    try {
      console.debug('[auth.logout] Sending logout request...');
      // Some backends expect refresh token in body for logout
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await client.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh_token: refreshToken,
      });
      console.debug('[auth.logout] Logout API call successful');
    } catch (error: any) {
      // Continue with logout even if API call fails (422, 401, etc.)
      console.debug('[auth.logout] Logout API call failed (continuing with local logout):', error.response?.status, error.message);
    }

    console.debug('[auth.logout] Clearing local tokens...');
    await apiClient.logout();
  }

  async getCurrentUser(): Promise<User> {
    const client = apiClient.getClient();
    const response = await client.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  async initializeAuth(): Promise<User | null> {
    try {
      console.debug('[auth.initializeAuth] Starting auth initialization...');

      console.debug('[auth.initializeAuth] Loading auth token from SecureStore...');
      await apiClient.loadAuthToken();
      console.debug('[auth.initializeAuth] Auth token loaded successfully');

      console.debug('[auth.initializeAuth] Fetching current user...');
      const user = await this.getCurrentUser();
      console.debug('[auth.initializeAuth] Current user fetched:', user);

      return user;
    } catch (error) {
      console.error('[auth.initializeAuth] Error during initialization:', error);
      await apiClient.logout();
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
