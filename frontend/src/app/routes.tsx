import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Dependents } from './pages/Dependents';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSpecialties } from './pages/admin/AdminSpecialties';
import { AdminLogs } from './pages/admin/AdminLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dependentes',
    element: <Dependents />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/usuarios',
    element: <AdminUsers />,
  },
  {
    path: '/admin/especialidades',
    element: <AdminSpecialties />,
  },
  {
    path: '/admin/logs',
    element: <AdminLogs />,
  },
  {
    path: '/admin/configuracoes',
    element: <AdminSettings />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
