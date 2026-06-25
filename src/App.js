import { useAuth, AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import InstructorDashboard from './components/Dashboard/InstructorDashboard';

function AppContent() {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      {profile?.role === 'instructor' ? <InstructorDashboard /> : <StudentDashboard />}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;