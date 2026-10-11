import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useStore();
  const state = location.state as { method?: string; value?: string; isNewUser?: boolean; name?: string } | null;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If accessed directly without state, redirect to login
  if (!state || !state.value) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call to backend
    setTimeout(() => {
      // For Phase 2.5 mock verification logic:
      if (otpValue === '000000') {
        setError('Invalid OTP code');
        setLoading(false);
        return;
      }

      // Success mock
      login('mock-jwt-token-xyz', {
        id: '123',
        username: state.name || 'User',
        email: state.value || '',
      });
      navigate('/store');
    }, 1500);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    // Simulate API resend
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
        <p className="text-gray-500 mb-6">
          We sent a verification code to:<br />
          <span className="font-semibold text-gray-900">{state.value}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={loading}
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center h-12"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className={`font-bold ${cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:underline'}`}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};
