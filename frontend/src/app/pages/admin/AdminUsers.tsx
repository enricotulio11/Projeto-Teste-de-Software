import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router';
import { Ban, Check, Edit, KeyRound, Search, User as UserIcon, UserCheck, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAllDependents, fetchUsers, updateUserById } from '../../services/medagenda';
import { Dependent, User } from '../../types';
import { formatCPF } from '../../utils/validation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

type UserWithType = (User | Dependent) & {
  type: 'Responsável' | 'Dependente';
  status: 'active' | 'inactive';
};

export function AdminUsers() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithType | null>(null);
  const [actionType, setActionType] = useState<'reset' | 'block' | 'edit' | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [currentUser, isAdmin, navigate]);

  const loadData = async () => {
    try {
      const [allUsers, allDependents] = await Promise.all([
        fetchUsers(),
        fetchAllDependents(),
      ]);

      setUsers([
        ...allUsers.map(user => ({
          ...user,
          type: 'Responsável' as const,
          status: (user.status || 'active') as 'active' | 'inactive',
        })),
        ...allDependents.map(dependent => ({
          ...dependent,
          type: 'Dependente' as const,
          status: dependent.active === false ? 'inactive' as const : 'active' as const,
        })),
      ]);
    } catch {
      toast.error('Não foi possível carregar os usuários');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm.replace(/\D/g, '')),
  );

  const openDialog = (user: UserWithType, action: 'reset' | 'block' | 'edit') => {
    setSelectedUser(user);
    setActionType(action);
    setShowDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    if (actionType === 'reset') {
      toast.info('Reset de PIN será integrado quando o PIN existir no backend');
    }

    if (actionType === 'edit') {
      toast.info('Edição de perfil será integrada em uma próxima etapa');
    }

    if (actionType === 'block' && selectedUser.type === 'Responsável') {
      try {
        const shouldActivate = selectedUser.status !== 'active';
        await updateUserById(selectedUser.id, {
          active: shouldActivate,
          blocked: !shouldActivate,
        });
        toast.success(shouldActivate ? 'Usuário desbloqueado com sucesso' : 'Usuário bloqueado com sucesso');
        await loadData();
      } catch {
        toast.error('Não foi possível atualizar o usuário');
      }
    }

    setShowDialog(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const totalResponsaveis = users.filter(user => user.type === 'Responsável').length;
  const totalDependentes = users.filter(user => user.type === 'Dependente').length;
  const totalAtivos = users.filter(user => user.status === 'active').length;
  const totalInativos = users.filter(user => user.status === 'inactive').length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard icon={UserIcon} label="Responsáveis" value={totalResponsaveis} tone="blue" />
          <StatsCard icon={UserCheck} label="Dependentes" value={totalDependentes} tone="green" />
          <StatsCard icon={Check} label="Ativos" value={totalAtivos} tone="green" />
          <StatsCard icon={X} label="Inativos" value={totalInativos} tone="red" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Lista completa de responsáveis e dependentes cadastrados no sistema
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">CPF</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={`${user.type}-${user.id}`} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-gray-600">{formatCPF(user.cpf)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.type === 'Responsável' ? 'default' : 'secondary'}
                            className={user.type === 'Responsável' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                          >
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {user.type === 'Responsável' ? (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => openDialog(user, 'reset')} title="Resetar PIN">
                                  <KeyRound className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openDialog(user, 'edit')} title="Editar Perfil">
                                  <Edit className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openDialog(user, 'block')} title="Bloquear/Desbloquear">
                                  <Ban className={`h-4 w-4 ${user.status === 'active' ? 'text-red-600' : 'text-gray-400'}`} />
                                </Button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'reset' && 'Resetar PIN de Segurança'}
                {actionType === 'edit' && 'Editar Perfil'}
                {actionType === 'block' && (selectedUser?.status === 'active' ? 'Bloquear Acesso' : 'Desbloquear Acesso')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'block'
                  ? `Confirma a alteração de acesso de ${selectedUser?.name}?`
                  : 'Esta ação ainda depende de suporte completo no backend.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAction}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'red';
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`${colors[tone]} p-2 rounded`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
