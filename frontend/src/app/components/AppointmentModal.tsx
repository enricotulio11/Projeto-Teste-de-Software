import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Appointment, Dependent, User as AppUser } from '../types';
import { AVAILABLE_HOURS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { BackendLocation, BackendSpecialty } from '../services/medagenda';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  appointment: Appointment | null;
  dependents: Dependent[];
  doctors: AppUser[];
  specialties: BackendSpecialty[];
  locations: BackendLocation[];
  onSave: (appointment: Partial<Appointment>) => void;
  onDelete?: () => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  date,
  appointment,
  dependents,
  doctors,
  specialties,
  locations,
  onSave,
  onDelete,
}: AppointmentModalProps) {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    time: '',
    doctorId: '',
    doctorName: '',
    locationId: '',
    location: '',
    specialtyId: '',
    specialty: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        time: appointment.time,
        doctorId: appointment.doctorId ?? '',
        doctorName: appointment.doctorName ?? '',
        locationId: appointment.locationId ?? '',
        location: appointment.location,
        specialtyId: appointment.specialtyId ?? '',
        specialty: appointment.specialty,
      });
      setIsEditing(false);
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        time: '',
        doctorId: doctors[0]?.id ?? '',
        doctorName: doctors[0]?.name ?? '',
        locationId: '',
        location: '',
        specialtyId: '',
        specialty: '',
      });
      setIsEditing(true);
    }
  }, [appointment, doctors, isOpen]);

  const handlePatientChange = (value: string) => {
    if (value === currentUser?.id) {
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: currentUser.name,
      }));
      return;
    }

    const dependent = dependents.find(item => item.id === value);
    if (dependent) {
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: dependent.name,
      }));
    }
  };

  const handleSubmit = () => {
    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.locationId ||
      !formData.specialtyId ||
      !formData.time
    ) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    onSave(formData);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const patients = [
    { id: currentUser?.id || '', name: currentUser?.name || '' },
    ...dependents.map(item => ({ id: item.id, name: item.name })),
  ].filter(patient => patient.id);

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
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-lg">Data: {formatDate(date)}</span>
            </div>
          </div>

          {appointment && !isEditing ? (
            <div className="space-y-4">
              <Detail icon={User} label="Paciente" value={formData.patientName} />
              <Detail icon={User} label="Médico" value={formData.doctorName || 'Não informado'} />
              <Detail icon={Clock} label="Horário" value={formData.time} />
              <Detail icon={MapPin} label="Local" value={formData.location} />
              <Detail icon={Stethoscope} label="Especialidade" value={formData.specialty} />

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
                <Label htmlFor="doctor" className="text-lg mb-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Médico *
                </Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => {
                    const doctor = doctors.find(item => item.id === value);
                    setFormData(prev => ({
                      ...prev,
                      doctorId: value,
                      doctorName: doctor?.name ?? '',
                    }));
                  }}
                >
                  <SelectTrigger id="doctor" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id} className="text-lg">
                        {doctor.name}
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
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => {
                    const location = locations.find(item => item.id === value);
                    setFormData(prev => ({
                      ...prev,
                      locationId: value,
                      location: location ? `${location.nome} - ${location.cidade}/${location.estado}` : '',
                    }));
                  }}
                >
                  <SelectTrigger id="location" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id} className="text-lg">
                        {location.nome} - {location.cidade}/{location.estado}
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
                <Select
                  value={formData.specialtyId}
                  onValueChange={(value) => {
                    const specialty = specialties.find(item => item.id === value);
                    setFormData(prev => ({
                      ...prev,
                      specialtyId: value,
                      specialty: specialty?.nome ?? '',
                    }));
                  }}
                >
                  <SelectTrigger id="specialty" className="h-12 text-lg">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty.id} value={specialty.id} className="text-lg">
                        {specialty.nome}
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
                <Button onClick={handleSubmit} className="flex-1 h-12 text-lg">
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

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <span className="font-semibold">{label}:</span>
      </div>
      <p className="text-lg ml-7">{value}</p>
    </div>
  );
}
