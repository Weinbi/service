import { Navigate, Route, Routes } from 'react-router-dom';
import { layoutsRoutes, singlePageRoutes } from './Routes';
import PageWrapper from '@/components/PageWrapper';
import AuthGuard from '@/components/AuthGuard';

const AppRoutes = () => {
  return (
    <Routes>

      {layoutsRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <AuthGuard>
              <PageWrapper>{route.element}</PageWrapper>
            </AuthGuard>
          }
        />
      ))}

      {singlePageRoutes.map(route => (
        <Route key={route.name} path={route.path} element={route.element} />
      ))}

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;