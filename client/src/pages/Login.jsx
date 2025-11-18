import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.js';

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      await login(email, password);
      onLoggedIn?.();
      if (window.showNotification) {
        window.showNotification('Login successful!', 'success');
      }
      navigate('/');
    } catch (e) {
      const errorMsg = e.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      if (window.showNotification) {
        window.showNotification(errorMsg, 'error');
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-5xl animate-fade-in">
        <div className="card-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Login Form */}
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-md">
                    <img src="/logo.svg" alt="Medicare Pro" className="h-7 w-7" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                </div>
                <p className="text-slate-300">Sign in to your account to continue</p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    className={`input ${error ? 'input-error' : ''}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <input
                    className={`input ${error ? 'input-error' : ''}`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-danger-500/10 border border-danger-500/40 p-3 text-sm text-danger-200 animate-slide-down">
                    {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full text-base py-3">
                  Sign in
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block relative bg-gradient-to-br from-night-700 via-primary-700 to-accent-700 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
              <div className="relative h-full p-10 flex flex-col justify-between">
                <div className="mt-8">
                  <div className="mb-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-white animate-slide-up">
                    <h3 className="mb-3 text-xl font-semibold">Why Medicare Pro?</h3>
                    <ul className="space-y-3 text-sm text-white/90">
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Streamlined patient management</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Secure medical records</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Smart appointments overview</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mb-8">
                  <img
                    src="/images/medical-hero.svg"
                    alt="Healthcare illustration"
                    className="w-full h-auto opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


