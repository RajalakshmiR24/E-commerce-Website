import { api, endpoints, ApiError } from './api';
import { setAuthToken, removeAuthToken } from '../config/api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface PhoneOtpRequest {
  phone: string;
}

export interface VerifyPhoneOtpRequest {
  otp: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endpoints.auth.login, credentials);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        return response.data;
      }
      
      throw new ApiError(response.message || 'Login failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed. Please try again.', 500);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endpoints.auth.register, userData);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        return response.data;
      }
      
      throw new ApiError(response.message || 'Registration failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed. Please try again.', 500);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>(endpoints.auth.me);
      
      if (response.success && response.data) {
        return response.data.user;
      }
      
      throw new ApiError('Failed to get user data', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to get user data', 500);
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(endpoints.auth.forgotPassword, data);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'Failed to send reset email', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to send reset email', 500);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endpoints.auth.resetPassword, data);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        return response.data;
      }
      
      throw new ApiError(response.message || 'Password reset failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Password reset failed', 500);
    }
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(endpoints.auth.verifyEmail, data);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'Email verification failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Email verification failed', 500);
    }
  }

  async resendVerification(): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(endpoints.auth.resendVerification);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'Failed to resend verification', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to resend verification', 500);
    }
  }

  async sendPhoneOtp(data: PhoneOtpRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(endpoints.auth.sendPhoneOtp, data);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'Failed to send OTP', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to send OTP', 500);
    }
  }

  async verifyPhoneOtp(data: VerifyPhoneOtpRequest): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(endpoints.auth.verifyPhoneOtp, data);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'OTP verification failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('OTP verification failed', 500);
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>(endpoints.auth.changePassword, data);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new ApiError(response.message || 'Password change failed', 400);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Password change failed', 500);
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // In a real implementation, this would handle Google OAuth flow
      // For now, we'll simulate the process
      window.location.href = `${endpoints.auth.googleAuth}`;
      
      // This would be handled by the callback
      throw new ApiError('Google login redirect initiated', 302);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Google login failed', 500);
    }
  }
}

export const authService = new AuthService();