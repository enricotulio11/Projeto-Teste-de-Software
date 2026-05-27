import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Stethoscope, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Appointment, Dependent, Location, Specialty } from '../types';
import { AVAILABLE_HOURS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { catalogsApi, dependentsApi } from '../services/api';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointment: Appointment | null;
  onSave: (appointment: Partial<Appointment>) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

export function AppointmentModal({
  isOpen,
  onClose,
  date,
  appointment,
  onSave,
  onDelete,
}: AppointmentModalProps) {
  const { currentUser } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    time: '',
    locationId: '',
    location: '',
    specialtyId: '',
    specialty: '',
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      Promise.all([
        dependentsApi.list(),
        catalogsApi.specialties(),
        catalogsApi.locations(),
      ]).then(([deps, specialtyData, locationData]) => {
        setDependents(deps);
        setSpecialties(specialtyData);
        setLocations(locationData);
      });
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        time: appointment.time,
        locationId: appointment.locationId,
        location: appointment.location,
        specialtyId: appointment.specialtyId,
        specialty: appointment.specialty,
      });
      setIsEditing(false);
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        time: '',
        locationId: '',
        location: '',
        specialtyId: '',
        specialty: '',
      });
      setIsEditing(true);
    }
  }, [appointment, isOpen]);

  const handlePatientChange = (value: string) => {
    if (value === currentUser?.id) {
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: currentUser.name,
      }));
    } else {
      const dep = dependents.find(d => d.id === value);
      if (dep) {
        setFormData(prev => ({
          ...prev,
          patientId: value,
          patientName: dep.name,
        }));
      }
    }
  };

  const handleLocationChange = (value: string) => {
    const location = locations.find((item) => item.id === value);
    setFormData((previous) => ({
      ...previous,
      locationId: value,
      location: location?.displayName ?? '',
    }));
  };

  const handleSpecialtyChange = (value: string) => {
    const specialty = specialties.find((item) => item.id === value);
    setFormData((previous) => ({
      ...previous,
      specialtyId: value,
      specialty: specialty?.name ?? '',
    }));
  };

  const handleSubmit = async () => {
    // Validação RdN04 - Composição Mínima de Agendamento
    if (!formData.patientId || !formData.locationId || !formData.specialtyId || !formData.time) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    await onSave(formData);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const patients = [
    { id: currentUser?.id || '', name: currentUser?.name || '' },
    ...dependents.map(d => ({ id: d.id, name: d.name })),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            {appointment && !isEditing ? 'Detalhes da Consulta' : 'Agendar Consulta'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Data */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-lg">Data: {formatDate(date)}</span>
            </div>
          </div>

          {/* Visualização ou Edição */}
          {appointment && !isEditing ? (
            // Modo de visualização
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Paciente:</span>
                </div>
                <p className="text-lg ml-7">{formData.patientName}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Horário:</span>
                </div>
                <p className="text-lg ml-7">{formData.time}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Local:</span>
                </div>
                <p className="text-lg ml-7">{formData.location}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Especialidade:</span>
                </div>
                <p className="text-lg ml-7">{formData.specialty}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="flex-1 h-12 text-lg"
                  variant="outline"
                >
                  Editar Consulta
                </Button>
                <Button 
                  onClick={onDelete} 
                  className="flex-1 h-12 text-lg"
                  variant="destructive"
                >
                  Desmarcar Consulta
                </Button>
              </div>
            </div>
          ) : (
            // Modo de edição/criação
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient" className="text-lg mb-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Paciente *
                </Label>
                <Select value={formData.patientId} onValueChange={handlePatientChange}>
                  <SelectTrigger id="patient" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id} className="text-lg">
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time" className="text-lg mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário *
                </Label>
                <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                  <SelectTrigger id="time" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_HOURS.map(hour => (
                      <SelectItem key={hour} value={hour} className="text-lg">
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-lg mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Local *
                </Label>
                <Select value={formData.locationId} onValueChange={handleLocationChange}>
                  <SelectTrigger id="location" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id} className="text-lg">
                        {location.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialty" className="text-lg mb-2 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Especialidade *
                </Label>
                <Select value={formData.specialtyId} onValueChange={handleSpecialtyChange}>
                  <SelectTrigger id="specialty" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty.id} value={specialty.id} className="text-lg">
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                {appointment && (
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline"
                    className="flex-1 h-12 text-lg"
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 h-12 text-lg"
                >
                  {appointment ? 'Salvar Alterações' : 'Marcar Consulta'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
