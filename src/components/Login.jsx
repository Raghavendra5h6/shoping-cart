import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import api from '../api';

const TOKEN_STORAGE = 'token';

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { username, password });
      localStorage.setItem(TOKEN_STORAGE, data.token);
      onLoggedIn(true);
    } catch (err) {
      if (err.response?.status === 403) {
        window.alert('You cannot login on another device.');
      } else {
        setMessage(err.response?.data || 'Invalid username/password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/users', { username, password });
      setMessage('Account created. You can log in now.');
      setIsRegister(false);
    } catch (err) {
      setMessage(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isRegister ? handleRegister : handleLogin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
          {isRegister ? 'Create account' : 'Sign in'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>
          {message && (
            <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {isRegister ? (
              <>
                <UserPlus size={18} />
                Register
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign in
              </>
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setMessage(''); }}
                className="text-emerald-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              No account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setMessage(''); }}
                className="text-emerald-600 font-medium hover:underline"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
