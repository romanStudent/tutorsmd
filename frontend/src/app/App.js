import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
import { RouterProvider } from './providers/RouterProvider';
import { useInitAuth } from './hooks/useInAuth';
import { Spinner } from '@shared/index';
export const App = () => {
    const { isReady } = useInitAuth();
    if (!isReady) {
        return _jsx(Spinner, { fullscreen: true });
    }
    return (_jsx(Suspense, { fallback: _jsx(Spinner, { fullscreen: true }), children: _jsx(RouterProvider, {}) }));
};
