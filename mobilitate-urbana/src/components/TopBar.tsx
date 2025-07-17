import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error || !data.user) {
          setError(error?.message || 'Registration failed.');
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) {
          setError(error?.message || 'Login failed.');
          return;
        }
      }
      setShowModal(false);
    } catch {
      setError(`Unexpected error during ${isRegister ? 'registration' : 'login'}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="user-auth-bar">
        <div className="app-title">Mobilitate pietonală</div>
        <div className="user-section">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowModal(true)}>Login / Register</button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="auth-modal">
          <div className="auth-modal-content">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
              </button>
            </form>

            <button className="auth-cancel" onClick={() => setShowModal(false)}>
              Cancel
            </button>

            <button
              className="auth-cancel"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
            >
              {isRegister ? 'Already have an account? Login' : 'New here? Register'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
