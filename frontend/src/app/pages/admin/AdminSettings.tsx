import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Settings as SettingsIcon, Database, Bell, Shield, Globe, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../services/api';
import { SystemSettings } from '../../types';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

export function AdminSettings() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'MedAgenda',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    maxDependentsPerUser: 5,
    sessionTimeout: 30,
    enableSecurityLogs: true,
    requireStrongPasswords: false,
  });

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login');
      return;
    }
    void adminApi.settings().then(setSettings);
  }, [currentUser, isAdmin, navigate]);

  const handleSave = async () => {
    try {
      setSettings(await adminApi.updateSettings(settings));
      toast.success('Configurações salvas com sucesso!');
    } catch {
      toast.error('Nao foi possivel salvar as configuracoes.');
    }
  };

  const handleReset = () => {
    setSettings({
      systemName: 'MedAgenda',
      maintenanceMode: false,
      allowRegistrations: true,
      emailNotifications: true,
      maxDependentsPerUser: 5,
      sessionTimeout: 30,
      enableSecurityLogs: true,
      requireStrongPasswords: false,
    });
    toast.info('Configurações restauradas para os valores padrão');
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              <CardTitle>Configurações do Sistema</CardTitle>
            </div>
            <CardDescription>
              Configure os parâmetros gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="systemName">Nome do Sistema</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                placeholder="MedAgenda"
              />
              <p className="text-sm text-gray-500">
                Nome que aparecerá em todo o sistema
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-gray-500">
                  Bloqueia acesso de usuários comuns ao sistema
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Novos Cadastros</Label>
                <p className="text-sm text-gray-500">
                  Permite que novos usuários se cadastrem
                </p>
              </div>
              <Switch
                checked={settings.allowRegistrations}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, allowRegistrations: checked })
                }
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxDependents">Máximo de Dependentes por Usuário</Label>
                <Input
                  id="maxDependents"
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxDependentsPerUser}
                  onChange={(e) => 
                    setSettings({ ...settings, maxDependentsPerUser: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) => 
                    setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Configurações de Segurança</CardTitle>
            </div>
            <CardDescription>
              Gerencie políticas de segurança do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Habilitar Logs de Segurança</Label>
                <p className="text-sm text-gray-500">
                  Registra todas as atividades de login e segurança
                </p>
              </div>
              <Switch
                checked={settings.enableSecurityLogs}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, enableSecurityLogs: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exigir Senhas Fortes</Label>
                <p className="text-sm text-gray-500">
                  Requer letras maiúsculas, minúsculas e números
                </p>
              </div>
              <Switch
                checked={settings.requireStrongPasswords}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, requireStrongPasswords: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Configurações de Notificações</CardTitle>
            </div>
            <CardDescription>
              Configure como os usuários recebem notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-gray-500">
                  Envia e-mails para lembrar consultas agendadas
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Gestão de Dados</CardTitle>
            </div>
            <CardDescription>
              Ferramentas de manutenção do banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full">
                Backup do Sistema
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Limpar Cache
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Importante:</strong> Todas as operações de dados são registradas
                  e devem ser realizadas com cautela. Consulte a documentação antes de
                  executar operações de manutenção.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={handleReset}>
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>

        {/* System Info */}
        <Card className="bg-gray-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Informações do Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Versão:</span>
                <span className="ml-2 font-semibold">v1.0.0</span>
              </div>
              <div>
                <span className="text-gray-600">Ambiente:</span>
                <span className="ml-2 font-semibold">Produção</span>
              </div>
              <div>
                <span className="text-gray-600">Última Atualização:</span>
                <span className="ml-2 font-semibold">
                  {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-semibold text-green-600">Operacional</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
