import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { setupInterceptors } from './api/interceptors';
import { AppRoutes } from './routes';

function App() {
  const { logout } = useAuth();

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  return <AppRoutes />;
}

export default App;
