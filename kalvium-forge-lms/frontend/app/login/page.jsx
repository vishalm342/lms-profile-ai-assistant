"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const KalviumLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#4F46E5"/>
    <path d="M9 29V25L11 23V17L9 15V11H11V13H13V11H15V13H17V11H19V15L17 17V18H23V17L21 15V11H23V13H25V11H27V13H29V11H31V15L29 17V23L31 25V29H22V26C22 25.45 21.8042 24.9792 21.4125 24.5875C21.0208 24.1958 20.55 24 20 24C19.45 24 18.9792 24.1958 18.5875 24.5875C18.1958 24.9792 18 25.45 18 26V29H9ZM11 27H16V26C16 24.9 16.3917 23.9583 17.175 23.175C17.9583 22.3917 18.9 22 20 22C21.1 22 22.0417 22.3917 22.825 23.175C23.6083 23.9583 24 24.9 24 26V27H29V25.825L27 23.825V16.175L28.175 15H23.825L25 16.175V20H15V16.175L16.175 15H11.825L13 16.175V23.825L11 25.825V27Z" fill="white"/>
  </svg>
);

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      if (response.data.success) {
        localStorage.setItem('studentId', response.data.student.id);
        localStorage.setItem('studentName', response.data.student.full_name);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        full_name: regName,
        email: regEmail,
        password: regPassword,
      });
      if (response.data.success) {
        setMessage('Account created! Please sign in.');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  const handleTabSwitch = (tab) => {
    setIsLogin(tab);
    setError('');
    setMessage('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <KalviumLogo />
          <h1 className="text-xl font-bold text-gray-900">Kalvium Forge</h1>
          <p className="text-sm text-gray-500">Enterprise-grade learning platform</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
              isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
              !isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{message}</div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Work Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="name@enterprise.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="keep-signed" className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600" />
              <label htmlFor="keep-signed" className="text-xs text-gray-500">Keep me signed in on this device</label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Continue to Dashboard →
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              By continuing, you agree to Kalvium Forge&apos;s{' '}
              <a href="#" className="underline">Terms of Service</a> and Privacy Policy.
            </p>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Work Email</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="name@enterprise.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}