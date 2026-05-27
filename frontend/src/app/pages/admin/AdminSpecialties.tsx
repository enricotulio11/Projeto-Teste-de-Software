import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Stethoscope, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminLayout } from '../../components/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { SPECIALTIES, CITIES } from '../../utils/constants';

export function AdminSpecialties() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/login');
      return;
    }
  }, [currentUser, isAdmin, navigate]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Especialidades</p>
                  <p className="text-3xl font-bold">{SPECIALTIES.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Locais</p>
                  <p className="text-3xl font-bold">{CITIES.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Especialidades Médicas</CardTitle>
                <CardDescription>
                  Lista de especialidades disponíveis para agendamento
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SPECIALTIES.map((specialty, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <Stethoscope className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{specialty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cities/Locations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Locais de Atendimento</CardTitle>
                <CardDescription>
                  Cidades disponíveis para agendamento de consultas
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {CITIES.map((city, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 p-2 rounded">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Informação</h3>
                <p className="text-sm text-blue-800">
                  As especialidades e locais cadastrados aqui estarão disponíveis para todos os usuários
                  durante o agendamento de consultas. Mantenha a lista atualizada conforme necessário.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
