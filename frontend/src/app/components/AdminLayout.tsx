import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Visão Geral' },
  { path: '/admin/usuarios', icon: Users, label: 'Gestão de Usuários' },
  { path: '/admin/especialidades', icon: MapPin, label: 'Especialidades e Locais' },
  { path: '/admin/logs', icon: Shield, label: 'Logs de Segurança' },
  { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
            <div>
              <h1 className="text-xl font-bold">MedAgenda</h1>
              <p className="text-xs text-gray-400">Painel Admin</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-gray-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">
              {menuItems.find(item => isActive(item.path))?.label || 'Visão Geral'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Visão Cliente</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate('/admin/configuracoes')}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Configurações</span>
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Bem-vindo,</span>
              <span className="font-semibold text-gray-900">{currentUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}