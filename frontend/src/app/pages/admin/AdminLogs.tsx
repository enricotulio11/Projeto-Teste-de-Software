import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

interface SecurityLog {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_reset' | 'user_blocked' | 'user_created';
  user: string;
  cpf: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

export function AdminLogs() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login');
      return;
    }
    loadLogs();
  }, [currentUser, isAdmin, navigate]);

  const loadLogs = () => {
    // Simular logs de segurança
    const mockLogs: SecurityLog[] = [
      {
        id: '1',
        type: 'login',
        user: 'Administrador',
        cpf: '000.000.000-00',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1',
        details: 'Login realizado com sucesso',
      },
      {
        id: '2',
        type: 'failed_login',
        user: 'João Silva',
        cpf: '123.456.789-00',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.105',
        details: 'Tentativa de login com senha incorreta',
      },
      {
        id: '3',
        type: 'user_created',
        user: 'Maria Santos',
        cpf: '987.654.321-00',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ipAddress: '192.168.1.50',
        details: 'Novo usuário cadastrado no sistema',
      },
      {
        id: '4',
        type: 'password_reset',
        user: 'Pedro Costa',
        cpf: '111.222.333-44',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        ipAddress: '192.168.1.75',
        details: 'PIN de segurança resetado pelo administrador',
      },
      {
        id: '5',
        type: 'logout',
        user: 'Ana Paula',
        cpf: '555.666.777-88',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        ipAddress: '192.168.1.90',
        details: 'Logout realizado',
      },
    ];

    setLogs(mockLogs);
  };

  const getLogIcon = (type: SecurityLog['type']) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'logout':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'failed_login':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'password_reset':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'user_blocked':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'user_created':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogBadge = (type: SecurityLog['type']) => {
    switch (type) {
      case 'login':
        return <Badge className="bg-green-100 text-green-800">Login</Badge>;
      case 'logout':
        return <Badge className="bg-gray-100 text-gray-800">Logout</Badge>;
      case 'failed_login':
        return <Badge className="bg-red-100 text-red-800">Falha Login</Badge>;
      case 'password_reset':
        return <Badge className="bg-orange-100 text-orange-800">Reset PIN</Badge>;
      case 'user_blocked':
        return <Badge className="bg-red-100 text-red-800">Bloqueio</Badge>;
      case 'user_created':
        return <Badge className="bg-blue-100 text-blue-800">Cadastro</Badge>;
      default:
        return <Badge>Outro</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR'),
    };
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Logins Hoje</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Falhas Hoje</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ações Admin</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Últimas 24h</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Atividades de Segurança</CardTitle>
            <CardDescription>
              Monitoramento de todas as atividades relacionadas à segurança do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Usuário</TableHead>
                    <TableHead className="font-semibold">CPF</TableHead>
                    <TableHead className="font-semibold">Data/Hora</TableHead>
                    <TableHead className="font-semibold">IP</TableHead>
                    <TableHead className="font-semibold">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const { date, time } = formatTimestamp(log.timestamp);
                    return (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLogIcon(log.type)}
                            {getLogBadge(log.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell className="text-gray-600">{log.cpf}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{date}</div>
                            <div className="text-gray-500">{time}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell className="text-gray-600">{log.details}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Exibindo {logs.length} registros recentes
            </div>
          </CardContent>
        </Card>

        {/* Alert */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 p-2 rounded">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Conformidade com LGPD</h3>
                <p className="text-sm text-amber-800">
                  Todos os logs de segurança são armazenados de forma segura e conforme a Lei Geral de
                  Proteção de Dados (LGPD). Os registros são mantidos por 90 dias e depois automaticamente
                  removidos do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
