import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import StudentDashboard from './components/Dashboard/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;