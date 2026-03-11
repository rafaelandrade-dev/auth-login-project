import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from './api/interceptors';
import { AppRoutes } from './routes';

function InterceptorSetup({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cleanup = setupInterceptors(navigate);
    setIsReady(true);
    return cleanup;
  }, [navigate]);

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
