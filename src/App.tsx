import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from './api/interceptors';
import { AppRoutes } from './routes';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const cleanupInterceptors = setupInterceptors(navigate);

    return () => {
      cleanupInterceptors();
    };
  }, [navigate]);

  return <AppRoutes />;
}

export default App;
