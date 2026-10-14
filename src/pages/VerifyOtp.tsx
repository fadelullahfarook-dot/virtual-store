
import { useState, useEffect, useRef } from 'react';
import {
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { useStore } from '../store/useStore';

interface VerifyState {
  method?: 'email' | 'phone';
  value?: string;
  isNewUser?: boolean;
  name?: string;
  debugOtp?: string;
}

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useStore();

  const state = location.state as VerifyState | null;
  const API_URL = import.meta.env.VITE_API_URL;

  const [otp, setOtp] = useState([
    '', '', '', '', '', '',
  ]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (state?.debugOtp && typeof state.debugOtp === 'string' && state.debugOtp.length === 6) {
      setOtp(state.debugOtp.split(''));
    }
  }, [state?.debugOtp]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!state?.value || !state?.method) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');
    setSuccess('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pastedOtp) return;

    setOtp([
      ...pastedOtp.split(''),
      ...Array(6 - pastedOtp.length).fill(''),
    ]);

    inputRefs.current[
      Math.min(pastedOtp.length, 5)
    ]?.focus();

    setError('');
  };

  const handleVerify = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    if (!API_URL) {
      setError('API URL is not configured.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: state.value,
            method: state.method,
            otp: otpValue,
            isNewUser: state.isNewUser ?? false,
            name: state.name ?? '',
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || 'OTP verification failed.'
        );
      }

      if (!data.token || !data.user) {
        throw new Error(
          'The server did not return a login token. Check the backend response.'
        );
      }

      login(data.token, data.user);
      navigate('/store', { replace: true });
    } catch (err) {
      console.error('OTP verification error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending || loading) return;

    if (!API_URL) {
      setError('API URL is not configured.');
      return;
    }

    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${API_URL}/api/auth/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: state.value,
            method: state.method,
            isLogin: !(state.isNewUser ?? false),
            name: state.name ?? '',
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to resend OTP.'
        );
      }

      setOtp(['', '', '', '', '', '']);
      setCooldown(30);
      setSuccess('A new OTP has been requested.');
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend OTP error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to resend OTP. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your Account
        </h2>

        <p className="text-gray-500 mb-6">
          We sent a verification code to:
          <br />
          <span className="font-semibold text-gray-900">
            {state.value}
          </span>
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 text-red-600 text-sm font-medium bg-red-50 py-2 px-3 rounded-lg"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 text-green-700 text-sm font-medium bg-green-50 py-2 px-3 rounded-lg"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={
                  index === 0 ? 'one-time-code' : 'off'
                }
                pattern="[0-9]*"
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                required
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all disabled:bg-gray-100"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center h-12"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          Didn't receive the code?{' '}

          <button
            type="button"
            onClick={handleResend}
            disabled={
              cooldown > 0 || loading || resending
            }
            className={`font-bold ${cooldown > 0 || resending
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:underline'
              }`}
          >
            {resending
              ? 'Sending...'
              : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};