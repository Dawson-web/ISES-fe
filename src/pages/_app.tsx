import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 如果路径不在定义的路由中,重定向到404
  if (!Object.values(import.meta.glob('/src/pages/**/[a-z[]*.tsx')).some(
    route => route.toString().includes(location.pathname.replace(/\/+$/, ''))
  )) {
    navigate('/404')
  }

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
} 