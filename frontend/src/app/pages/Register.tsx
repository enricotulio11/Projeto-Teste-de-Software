import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserPlus, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { validateCPF, validatePassword, validatePIN, validateName, formatCPF } from '../utils/validation';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpf(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setPassword(value);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setConfirmPassword(value);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setConfirmPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validações
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

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Senha deve ter exatamente 6 caracteres alfanuméricos';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!pin) {
      newErrors.pin = 'PIN é obrigatório';
    } else if (!validatePIN(pin)) {
      newErrors.pin = 'PIN deve ter exatamente 4 números';
    }

    if (pin !== confirmPin) {
      newErrors.confirmPin = 'Os PINs não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = register(name, cpf, password, pin);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: 'CPF já cadastrado ou erro ao criar conta' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <UserPlus className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription className="text-lg">
            Cadastre-se no MedAgenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-lg">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formatCPF(cpf)}
                onChange={handleCPFChange}
                className="h-12 text-lg"
              />
              {errors.cpf && (
                <p className="text-sm text-red-600">{errors.cpf}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="6 caracteres"
                value={password}
                onChange={handlePasswordChange}
                className="h-12 text-lg"
                maxLength={6}
              />
              <p className="text-sm text-gray-500">6 caracteres alfanuméricos (letras e números)</p>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-lg">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="h-12 text-lg"
                maxLength={6}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-lg flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                PIN de Segurança
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="4 dígitos"
                value={pin}
                onChange={handlePinChange}
                className="h-12 text-lg text-center tracking-widest"
                maxLength={4}
              />
              <p className="text-sm text-gray-500">4 números para proteger seus dados</p>
              {errors.pin && (
                <p className="text-sm text-red-600">{errors.pin}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-lg">Confirmar PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                placeholder="Repita o PIN"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                className="h-12 text-lg text-center tracking-widest"
                maxLength={4}
              />
              {errors.confirmPin && (
                <p className="text-sm text-red-600">{errors.confirmPin}</p>
              )}
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" size="lg">
              Criar Conta
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
