import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { formatCPF } from '../utils/validation';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cpf || !password) {
      setError('Preencha CPF e senha');
      return;
    }

    if (cpf.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);
    const user = await login(cpf, password);
    setIsSubmitting(false);

    if (user) {
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    } else {
      setError('CPF ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <LogIn className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">MedAgenda</CardTitle>
          <CardDescription className="text-lg">
            Sistema de Agendamento de Consultas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-lg">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formatCPF(cpf)}
                onChange={handleCPFChange}
                className="h-12 text-lg"
                autoComplete="username"
              />
              <p className="text-sm text-gray-500">Digite apenas números (11 dígitos)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
                autoComplete="current-password"
              />
              <p className="text-sm text-gray-500">Use a senha cadastrada na API</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Acessar'}
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="text-blue-600 font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
