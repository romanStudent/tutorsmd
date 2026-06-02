import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { RouterProvider } from './providers/RouterProvider';
import { useInitAuth } from './hooks/useInAuth';
import { Spinner } from '@shared/index';
import { useSessionManager } from './hooks/useSessionManager';


export const App = () => {
  const { isReady } = useInitAuth();
  useSessionManager();

  if (!isReady) {
    return <Spinner fullscreen />;
  }

  return (
    <HelmetProvider>
      <Suspense fallback={<Spinner fullscreen />}>
        <RouterProvider />
      </Suspense>
    </HelmetProvider>
  );
};
