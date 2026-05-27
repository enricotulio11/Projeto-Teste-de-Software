import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, KeyRound, Edit, Ban, Check, X, UserCheck, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers, getAllDependents, saveUser } from '../../utils/storage';
import { User, Dependent } from '../../types';
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
  userId?: string;
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

  const loadData = () => {
    const allUsers = getUsers();
    const allDependents = getAllDependents();

    // Combinar usuários e dependentes
    const combined: UserWithType[] = [
      ...allUsers.map(u => ({
        ...u,
        type: 'Responsável' as const,
        status: (u.status || 'active') as 'active' | 'inactive',
      })),
      ...allDependents.map(d => ({
        ...d,
        type: 'Dependente' as const,
        status: 'active' as const,
        password: '',
        pin: '',
        isAdmin: false,
      })),
    ];

    setUsers(combined);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm.replace(/\D/g, ''))
  );

  const handleResetPin = (user: UserWithType) => {
    setSelectedUser(user);
    setActionType('reset');
    setShowDialog(true);
  };

  const handleBlockUser = (user: UserWithType) => {
    setSelectedUser(user);
    setActionType('block');
    setShowDialog(true);
  };

  const handleEditUser = (user: UserWithType) => {
    toast.info('Funcionalidade de edição em desenvolvimento');
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    if (actionType === 'reset') {
      // Resetar PIN
      if (selectedUser.type === 'Responsável') {
        const newPin = Math.floor(1000 + Math.random() * 9000).toString();
        const updatedUser = { ...selectedUser, pin: newPin };
        saveUser(updatedUser as User);
        toast.success(`PIN resetado para: ${newPin}`, {
          description: 'O usuário deve anotar o novo PIN',
        });
        loadData();
      }
    } else if (actionType === 'block') {
      // Bloquear/Desbloquear usuário
      if (selectedUser.type === 'Responsável') {
        const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
        const updatedUser = { ...selectedUser, status: newStatus };
        saveUser(updatedUser as User);
        toast.success(
          newStatus === 'inactive' ? 'Usuário bloqueado com sucesso' : 'Usuário desbloqueado com sucesso'
        );
        loadData();
      }
    }

    setShowDialog(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const totalResponsaveis = users.filter(u => u.type === 'Responsável').length;
  const totalDependentes = users.filter(u => u.type === 'Dependente').length;
  const totalAtivos = users.filter(u => u.status === 'active').length;
  const totalInativos = users.filter(u => u.status === 'inactive').length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Responsáveis</p>
                  <p className="text-2xl font-bold">{totalResponsaveis}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dependentes</p>
                  <p className="text-2xl font-bold">{totalDependentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold">{totalAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold">{totalInativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
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
                      <TableRow key={user.id} className="hover:bg-gray-50">
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
                            {user.type === 'Responsável' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResetPin(user)}
                                  title="Resetar PIN de Segurança"
                                  className="hover:bg-blue-50"
                                >
                                  <KeyRound className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                  title="Editar Perfil"
                                  className="hover:bg-green-50"
                                >
                                  <Edit className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBlockUser(user)}
                                  title={user.status === 'active' ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
                                  className="hover:bg-red-50"
                                >
                                  <Ban className={`h-4 w-4 ${user.status === 'active' ? 'text-red-600' : 'text-gray-400'}`} />
                                </Button>
                              </>
                            )}
                            {user.type === 'Dependente' && (
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

            {filteredUsers.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Exibindo {filteredUsers.length} de {users.length} usuários
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'reset' && 'Resetar PIN de Segurança'}
                {actionType === 'block' && (selectedUser?.status === 'active' ? 'Bloquear Acesso' : 'Desbloquear Acesso')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'reset' && (
                  <>
                    Tem certeza que deseja resetar o PIN de segurança de <strong>{selectedUser?.name}</strong>?
                    <br /><br />
                    Um novo PIN de 4 dígitos será gerado automaticamente.
                  </>
                )}
                {actionType === 'block' && selectedUser?.status === 'active' && (
                  <>
                    Tem certeza que deseja bloquear o acesso de <strong>{selectedUser?.name}</strong>?
                    <br /><br />
                    O usuário não poderá mais fazer login no sistema.
                  </>
                )}
                {actionType === 'block' && selectedUser?.status === 'inactive' && (
                  <>
                    Tem certeza que deseja desbloquear o acesso de <strong>{selectedUser?.name}</strong>?
                    <br /><br />
                    O usuário poderá fazer login novamente no sistema.
                  </>
                )}
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
