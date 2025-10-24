import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IntroPage } from './views/IntroPage';
import { LoginPage } from './views/LoginPage.tsx';
import { SignupPage } from './views/SignupPage';
import { DashboardPage } from './views/DashboardPage';
import { CreateVideoPage } from './views/CreateVideoPage';
import { VideoDetailPage } from './views/VideoDetailPage';
import { AnalyticsPage } from './views/AnalyticsPage';
import { ProfilePage } from './views/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <IntroPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/cadastro" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criar-video"
          element={
            <ProtectedRoute>
              <CreateVideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:videoId"
          element={
            <ProtectedRoute>
              <VideoDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analises"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
