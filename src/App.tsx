import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from './api/interceptors';
import { AppRoutes } from './routes';
import { useAuth } from './contexts/AuthContext';

function InterceptorSetup({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cleanup = setupInterceptors(navigate, logout);
    setIsReady(true);
    return cleanup;
  }, [navigate, logout]);

  if (!isReady) return null;

  return <>{children}</>;
}

function App() {
  return (
    <InterceptorSetup>
      <AppRoutes />
    </InterceptorSetup>
  );
}

export default App;
