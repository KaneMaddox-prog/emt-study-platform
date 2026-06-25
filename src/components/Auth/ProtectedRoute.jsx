import { useAuth } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#3b82f6', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#ef4444', fontSize: '18px' }}>
          Access denied. This area is for {requiredRole}s only.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute