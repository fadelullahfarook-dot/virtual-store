
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useStore } from '../store/useStore';

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useStore();

  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('email');
  const [contactValue, setContactValue] = useState('');
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

  // Google Signup
  const handleGoogleSignup = useGoogleLogin({
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

        if (!data.token || !data.user) {
          throw new Error('Invalid response received from the server.');
        }

        login(data.token, data.user);
        navigate('/store');
      } catch (err) {
        console.error('Google Signup Error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Google Sign-Up failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setError('Google Sign-Up blocked (origin_mismatch): Please add http://localhost:5174 to Authorized JavaScript Origins in Google Cloud Console, or sign up with Email OTP.');
    },
  });

  // Email / Phone Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!contactValue.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }

    if (!API_URL) {
      setError('API URL is not configured.');
      return;
    }

    const finalValue =
      contactMethod === 'phone'
        ? `${countryCode}${contactValue.trim()}`
        : contactValue.trim();

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: finalValue,
          method: contactMethod,
          isLogin: false,
          name: name.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      navigate('/verify-otp', {
        state: {
          method: contactMethod,
          value: finalValue,
          isNewUser: true,
          name: name.trim(),
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
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Join Virtual Store today
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {contactMethod === 'email'
                  ? 'Email Address'
                  : 'Phone Number'}
              </label>

              <button
                type="button"
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => {
                  setContactMethod(
                    contactMethod === 'email' ? 'phone' : 'email'
                  );
                  setContactValue('');
                  setError('');
                }}
              >
                Use {contactMethod === 'email' ? 'Phone' : 'Email'} instead
              </button>
            </div>

            {contactMethod === 'phone' ? (
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
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  required
                />
              </div>
            ) : (
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                placeholder="you@example.com"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-2 disabled:opacity-60 flex justify-center items-center"
          >
            {loading ? 'Sending OTP...' : 'Continue to OTP'}
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
            handleGoogleSignup();
          }}
          disabled={loading}
        >
          <span className="font-bold text-lg leading-none">G</span>
          <span>
            {loading ? 'Authenticating...' : 'Sign up with Google'}
          </span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-bold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
