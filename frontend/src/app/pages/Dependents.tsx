import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, UserPlus, Trash2, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Dependent } from '../types';
import { getDependents, saveDependent, deleteDependent } from '../utils/storage';
import { validateCPF, validateName, formatCPF } from '../utils/validation';
import { toast } from 'sonner';

export function Dependents() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadDependents();
  }, [currentUser, navigate]);

  const loadDependents = () => {
    if (currentUser) {
      const deps = getDependents(currentUser.id);
      setDependents(deps);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validações conforme RF01
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (!validateName(name)) {
      newErrors.name = 'Nome deve conter apenas letras';
    }

    if (!cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Verifica se CPF já existe entre os dependentes
    const existingDependent = dependents.find(d => d.cpf === cpf);
    if (existingDependent) {
      newErrors.cpf = 'CPF já cadastrado como dependente';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!currentUser) return;

    const newDependent: Dependent = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      name: name.trim(),
      cpf,
      createdAt: new Date().toISOString(),
    };

    saveDependent(newDependent);
    toast.success(`Dependente ${name} cadastrado com sucesso!`);
    
    // Limpar formulário
    setName('');
    setCpf('');
    setErrors({});
    setIsAdding(false);
    loadDependents();
  };

  const handleDelete = (dependent: Dependent) => {
    if (window.confirm(`Tem certeza que deseja remover ${dependent.name} da lista de dependentes?`)) {
      deleteDependent(dependent.id);
      toast.success('Dependente removido com sucesso!');
      loadDependents();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="h-12"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-purple-600">Gerenciar Dependentes</h1>
              <p className="text-lg text-gray-600">Cadastre familiares para facilitar o agendamento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão adicionar */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="lg"
            className="mb-6 h-14 text-lg gap-2"
          >
            <UserPlus className="h-6 w-6" />
            Adicionar Dependente
          </Button>
        )}

        {/* Formulário de adição */}
        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Novo Dependente</CardTitle>
              <CardDescription className="text-lg">
                Preencha os dados do familiar ou dependente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg">Nome Completo *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome do dependente"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-gray-500">Apenas letras</p>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-lg">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formatCPF(cpf)}
                    onChange={handleCPFChange}
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-gray-500">CPF válido do dependente</p>
                  {errors.cpf && (
                    <p className="text-sm text-red-600">{errors.cpf}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setName('');
                      setCpf('');
                      setErrors({});
                    }}
                    variant="outline"
                    className="flex-1 h-12 text-lg"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-lg"
                  >
                    Salvar Perfil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de dependentes */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UsersIcon className="h-7 w-7" />
            Dependentes Cadastrados ({dependents.length})
          </h2>

          {dependents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UsersIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">
                  Nenhum dependente cadastrado ainda
                </p>
                <p className="text-gray-400 mt-2">
                  Clique em "Adicionar Dependente" para começar
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {dependents.map((dependent) => (
                <Card key={dependent.id}>
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{dependent.name}</h3>
                        <p className="text-lg text-gray-600">CPF: {formatCPF(dependent.cpf)}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Cadastrado em: {new Date(dependent.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDelete(dependent)}
                        variant="destructive"
                        size="lg"
                        className="h-12 w-12"
                        aria-label={`Remover ${dependent.name}`}
                      >
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info sobre responsável */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-lg mb-2">ℹ️ Informação</h3>
            <p className="text-gray-700">
              Você (responsável) também pode agendar consultas para si mesmo.
              Não é necessário se cadastrar como dependente.
            </p>
            <p className="text-gray-700 mt-2">
              Os dependentes cadastrados aqui aparecerão como opção ao agendar uma consulta.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
