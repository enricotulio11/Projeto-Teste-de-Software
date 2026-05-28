import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Trash2, UserPlus, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { Dependent } from '../types';
import { createDependent, deleteDependentById, fetchDependents } from '../services/medagenda';
import { formatCPF, validateCPF, validateName } from '../utils/validation';
import { toast } from 'sonner';

const RELATIONSHIPS = [
  { value: 'filho', label: 'Filho' },
  { value: 'filha', label: 'Filha' },
  { value: 'conjuge', label: 'Cônjuge' },
  { value: 'pai', label: 'Pai' },
  { value: 'mae', label: 'Mãe' },
  { value: 'irmao', label: 'Irmão' },
  { value: 'irma', label: 'Irmã' },
  { value: 'outro', label: 'Outro' },
];

export function Dependents() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [relationship, setRelationship] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadDependents();
  }, [currentUser, navigate]);

  const loadDependents = async () => {
    if (!currentUser) return;

    try {
      const deps = await fetchDependents(currentUser.id);
      setDependents(deps);
    } catch {
      toast.error('Não foi possível carregar os dependentes');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

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

    if (dependents.some(dependent => dependent.cpf === cpf)) {
      newErrors.cpf = 'CPF já cadastrado como dependente';
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
    }

    if (!relationship) {
      newErrors.relationship = 'Parentesco é obrigatório';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!currentUser) return;

    try {
      await createDependent({
        userId: currentUser.id,
        name: name.trim(),
        cpf,
        dateOfBirth,
        relationship,
      });

      toast.success(`Dependente ${name} cadastrado com sucesso!`);
      setName('');
      setCpf('');
      setDateOfBirth('');
      setRelationship('');
      setErrors({});
      setIsAdding(false);
      await loadDependents();
    } catch {
      toast.error('Não foi possível cadastrar o dependente');
    }
  };

  const handleDelete = async (dependent: Dependent) => {
    if (!window.confirm(`Tem certeza que deseja remover ${dependent.name} da lista de dependentes?`)) {
      return;
    }

    try {
      await deleteDependentById(dependent.id);
      toast.success('Dependente removido com sucesso!');
      await loadDependents();
    } catch {
      toast.error('Não foi possível remover o dependente');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
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
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
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
                  {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-lg">Data de Nascimento *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-12 text-lg"
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-lg">Parentesco *</Label>
                  <Select value={relationship} onValueChange={setRelationship}>
                    <SelectTrigger id="relationship" className="h-12 text-lg">
                      <SelectValue placeholder="Selecione o parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map(item => (
                        <SelectItem key={item.value} value={item.value} className="text-lg">
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relationship && <p className="text-sm text-red-600">{errors.relationship}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setName('');
                      setCpf('');
                      setDateOfBirth('');
                      setRelationship('');
                      setErrors({});
                    }}
                    variant="outline"
                    className="flex-1 h-12 text-lg"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 h-12 text-lg">
                    Salvar Perfil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

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
                        {dependent.dateOfBirth && (
                          <p className="text-sm text-gray-500 mt-1">
                            Nascimento: {new Date(`${dependent.dateOfBirth}T00:00:00`).toLocaleDateString('pt-BR')}
                          </p>
                        )}
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
      </main>
    </div>
  );
}
