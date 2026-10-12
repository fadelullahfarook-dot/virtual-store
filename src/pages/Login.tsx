
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useStore } from '../store/useStore';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useStore();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const API_URL = import.meta.env.VITE_API_URL;

  const COUNTRIES = [
    { code: '+1', label: 'US/CA (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+91', label: 'IN (+91)' },
    { code: '+61', label: 'AU (+61)' },
    { code: '+81', label: 'JP (+81)' },
    { code: '+49', label: 'DE (+49)' },
    { code: '+33', label: 'FR (+33)' },
  ];

  // Google Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!API_URL) {
        setError('API URL is not configured.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenResponse.access_token,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            data.message || 'Google authentication failed on backend.'
          );
        }

        login(data.token, data.user);
        navigate('/store');
      } catch (err) {
        console.error('Google Auth Error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Google Sign-In failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setError('Google Sign-In was cancelled or failed.');
    },
  });

  // Email / Phone Login using OTP
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError(`Please enter your ${method === 'email' ? 'email address' : 'phone number'}.`);
      return;
    }

    if (!API_URL) {
      setError('API URL is not configured.');
      return;
    }

    const finalValue =
      method === 'phone'
        ? `${countryCode}${inputValue.trim()}`
        : inputValue.trim();

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: finalValue,
          method,
          isLogin: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      navigate('/verify-otp', {
        state: {
          method,
          value: finalValue,
          isNewUser: false,
          debugOtp: data.debugOtp,
        },
      });
    } catch (err) {
      console.error('Send OTP error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Continue to Virtual Store
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {method === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>

              <button
                type="button"
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => {
                  setMethod(method === 'email' ? 'phone' : 'email');
                  setInputValue('');
                  setError('');
                }}
              >
                Use {method === 'email' ? 'Phone' : 'Email'} instead
              </button>
            </div>

            {method === 'phone' ? (
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-1/3 px-2 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  className="w-2/3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                  placeholder="9876543210"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                />
              </div>
            ) : (
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                placeholder="you@example.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex justify-center items-center"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
            OR
          </span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          onClick={() => {
            setError('');
            handleGoogleLogin();
          }}
          disabled={loading}
        >
          <span className="font-bold text-lg leading-none">G</span>
          <span>
            {loading ? 'Authenticating...' : 'Continue with Google'}
          </span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-600">
          New user?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
