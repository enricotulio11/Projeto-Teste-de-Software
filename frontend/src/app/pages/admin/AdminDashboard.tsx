import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, UserCheck, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers, getAllDependents } from '../../utils/storage';
import { Appointment } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalResponsaveis: number;
  totalDependentes: number;
  consultasEsteMes: number;
  alertasSistema: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalResponsaveis: 0,
    totalDependentes: 0,
    consultasEsteMes: 0,
    alertasSistema: 0,
  });
  const [chartData, setChartData] = useState<Array<{ day: string; agendamentos: number }>>([]);

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [currentUser, isAdmin, navigate]);

  const loadData = () => {
    // Carregar usuários e dependentes
    const users = getUsers();
    const dependents = getAllDependents();

    // Carregar consultas
    const appointmentsData = localStorage.getItem('medagenda_appointments');
    const appointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];

    // Calcular consultas deste mês
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const consultasEsteMes = appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    // Calcular alertas (usuários inativos por exemplo)
    const alertasSistema = 0; // Pode ser expandido com lógica real

    setStats({
      totalResponsaveis: users.length,
      totalDependentes: dependents.length,
      consultasEsteMes,
      alertasSistema,
    });

    // Gerar dados do gráfico (últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const chartData = last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const count = appointments.filter(app => app.date === dateStr).length;
      
      return {
        day: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
        agendamentos: count,
      };
    });

    setChartData(chartData);
  };

  const statCards = [
    {
      title: 'Total de Responsáveis',
      value: stats.totalResponsaveis,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Usuários cadastrados',
    },
    {
      title: 'Total de Idosos/Dependentes',
      value: stats.totalDependentes,
      icon: UserCheck,
      color: 'bg-green-500',
      description: 'Dependentes registrados',
    },
    {
      title: 'Consultas este Mês',
      value: stats.consultasEsteMes,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Agendamentos realizados',
    },
    {
      title: 'Alertas de Sistema',
      value: stats.alertasSistema,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      description: 'Requer atenção',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: card.color.replace('bg-', '') }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{card.description}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Agendamentos - Últimos 7 Dias</CardTitle>
            <CardDescription>
              Acompanhe a evolução dos agendamentos realizados na última semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAgendamentos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="agendamentos" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAgendamentos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 hover:border-blue-400"
            onClick={() => navigate('/admin/usuarios')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gerenciar Usuários</h3>
                  <p className="text-sm text-gray-600">Ver todos os usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 hover:border-green-400"
            onClick={() => navigate('/admin/especialidades')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Especialidades</h3>
                  <p className="text-sm text-gray-600">Gerenciar cadastros</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-orange-200 hover:border-orange-400"
            onClick={() => navigate('/admin/logs')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Logs de Segurança</h3>
                  <p className="text-sm text-gray-600">Monitorar atividades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
