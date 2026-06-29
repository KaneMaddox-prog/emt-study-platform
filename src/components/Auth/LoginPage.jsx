import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = ({ onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState(null);
  const [hasInvite, setHasInvite] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    if (token) {
      setInviteToken(token);
      setHasInvite(true);
      setMode('signup');
      setRole('instructor');
    }
  }, []);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, role, role === 'instructor' ? inviteToken : null);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '1px solid #1e3a5f',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Certavi
          </h1>
          {hasInvite && (
            <div style={{ backgroundColor: '#052e16', border: '1px solid #16a34a', borderRadius: '8px', padding: '8px 12px', marginTop: '12px' }}>
              <p style={{ color: '#22c55e', fontSize: '13px', margin: 0 }}>✓ Instructor invite detected</p>
            </div>
          )}
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e3a5f' }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1,
              padding: '10px',
              backgroundColor: mode === m ? '#3b82f6' : 'transparent',
              color: mode === m ? '#fff' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Fields */}
        {mode === 'signup' && (
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* Role selector (signup only, hidden if invite detected) */}
        {mode === 'signup' && !hasInvite && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px' }}>I am a:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setRole('student')} style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: `2px solid ${role === 'student' ? '#3b82f6' : '#1e3a5f'}`,
                backgroundColor: role === 'student' ? '#1e3a5f' : 'transparent',
                color: role === 'student' ? '#fff' : '#6b7280',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}>
                Student
              </button>
            </div>
            <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '8px' }}>
              Instructor accounts require an invite link.
            </p>
          </div>
        )}

        {hasInvite && mode === 'signup' && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Signing up as: <span style={{ color: '#22c55e', fontWeight: '600' }}>Instructor</span></p>
          </div>
        )}

        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '16px',
  backgroundColor: '#1f2937',
  border: '1px solid #1e3a5f',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  boxSizing: 'border-box',
};

export default LoginPage;
