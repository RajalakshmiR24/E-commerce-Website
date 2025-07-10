import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateRegistrationForm, getFieldError, hasFieldError, ValidationError } from '../../utils/validation';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { register, isLoading, error, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear validation errors for the field being edited
    setValidationErrors(prev => prev.filter(err => err.field !== name));
    clearError();
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors([]);

    // Client-side validation
    const validation = validateRegistrationForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.phone
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Join Abi Store today</p>
      </div>

      {(error || validationErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error && <div>{error}</div>}
          {validationErrors.map((err, index) => (
            <div key={index}>{err.message}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                hasFieldError(validationErrors, 'name')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {hasFieldError(validationErrors, 'name') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(validationErrors, 'name')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                hasFieldError(validationErrors, 'email')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {hasFieldError(validationErrors, 'email') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(validationErrors, 'email')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                hasFieldError(validationErrors, 'phone')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {hasFieldError(validationErrors, 'phone') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(validationErrors, 'phone')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                hasFieldError(validationErrors, 'password')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError(validationErrors, 'password') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(validationErrors, 'password')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                hasFieldError(validationErrors, 'confirmPassword')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {hasFieldError(validationErrors, 'confirmPassword') && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError(validationErrors, 'confirmPassword')}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};