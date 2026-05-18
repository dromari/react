/// <reference types="vite/client" />
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import About from './components/About/About';
import NotFound from './components/NotFound/NotFound';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: 'pokemon/:detailsId',
        element: <PokemonDetails />,
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode>
  );
}
