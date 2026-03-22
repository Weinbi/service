import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProvidersWrapper from './components/ProvidersWrapper';
import AppRoutes from './routes/index';

export default function App() {
  return (
    <BrowserRouter>
      <ProvidersWrapper>
        <AppRoutes />
      </ProvidersWrapper>
    </BrowserRouter>
  );
}
